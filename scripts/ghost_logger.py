#!/usr/bin/env python3
"""
Forhemit Ghost Logger
─────────────────────
Writes document generation logs and errors directly to Ghost (PostgreSQL).
Drop-in replacement for convex_logger.py — same function signatures.

Usage (as library):
    from ghost_logger import log_document, log_error

    log_document(
        document_type="preflight-internal",
        file_path="/path/to/preflight-internal-DHI-2026-001.pdf",
        company_name="Dark Horse Institute",
        ref="DHI-2026-001",
    )

Usage (CLI):
    python3 scripts/ghost_logger.py \\
        --type preflight-internal \\
        --file /path/to/file.pdf \\
        --company "Dark Horse Institute" \\
        --ref DHI-2026-001
"""

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

# ── Connection ──────────────────────────────────────────────────────────────

GHOST_CONNECTION_STRING = (
    "postgresql://tsdbadmin:j3nvynekex3cvlo5"
    "@jxkcqq6yua.nhbh1fxcou.tsdb.cloud.timescale.com:5432"
    "/tsdb?sslmode=require"
)


def _get_connection():
    """Get a psycopg3 connection to Ghost."""
    import psycopg

    conn_str = os.environ.get("GHOST_CONNECTION_STRING") or GHOST_CONNECTION_STRING
    return psycopg.connect(conn_str)


def _ensure_tables(conn) -> None:
    """Create tables if they don't exist (idempotent)."""
    with conn.cursor() as cur:
        cur.execute("""
            CREATE TABLE IF NOT EXISTS external_document_log (
                id SERIAL PRIMARY KEY,
                company_name TEXT,
                document_type TEXT NOT NULL,
                file_name TEXT NOT NULL,
                file_path TEXT,
                file_size_bytes INTEGER,
                generated_by TEXT,
                ref TEXT,
                status TEXT NOT NULL DEFAULT 'generated',
                metadata TEXT,
                created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
            );
            CREATE INDEX IF NOT EXISTS idx_edl_company ON external_document_log(company_name);
            CREATE INDEX IF NOT EXISTS idx_edl_created ON external_document_log(created_at);
            CREATE INDEX IF NOT EXISTS idx_edl_status ON external_document_log(status);
            CREATE INDEX IF NOT EXISTS idx_edl_type ON external_document_log(document_type);
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS document_generation_errors (
                id SERIAL PRIMARY KEY,
                company_name TEXT,
                document_type TEXT NOT NULL,
                ref TEXT,
                error_message TEXT NOT NULL,
                error_stack TEXT,
                source TEXT,
                created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
            );
            CREATE INDEX IF NOT EXISTS idx_dge_created ON document_generation_errors(created_at);
            CREATE INDEX IF NOT EXISTS idx_dge_type ON document_generation_errors(document_type);
        """)
    conn.commit()


# ── Public API ──────────────────────────────────────────────────────────────


def log_document(
    document_type: str,
    file_path: str,
    company_name: Optional[str] = None,
    ref: Optional[str] = None,
    company_id: Optional[str] = None,
    generated_by: str = "python-script",
    status: str = "generated",
    metadata: Optional[dict] = None,
    convex_url: Optional[str] = None,  # ignored, kept for API compat
) -> dict:
    """
    Log a generated document to Ghost.

    Args:
        document_type: One of preflight-internal, preflight-external,
                       nda-receipt, engagement-letter, term-sheet, etc.
        file_path: Absolute path to the generated PDF.
        company_name: Company name (for display).
        ref: Deal reference (e.g., "DHI-2026-001").
        company_id: Ignored (kept for convex_logger API compat).
        generated_by: Source script or skill name.
        status: Document status (generated, sent, approved, superseded).
        metadata: Extra context as a dict (serialized to JSON).
        convex_url: Ignored (kept for convex_logger API compat).

    Returns:
        Dict with {"success": bool, "documentId": int, ...}.
    """
    path = Path(file_path)

    try:
        conn = _get_connection()
        _ensure_tables(conn)

        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO external_document_log
                    (company_name, document_type, file_name, file_path,
                     file_size_bytes, generated_by, ref, status, metadata)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
                """,
                (
                    company_name,
                    document_type,
                    path.name,
                    str(path.resolve()),
                    path.stat().st_size if path.exists() else None,
                    generated_by,
                    ref,
                    status,
                    json.dumps(metadata) if metadata else None,
                ),
            )
            row = cur.fetchone()
            doc_id = row[0] if row else None

        conn.commit()
        conn.close()

        return {"success": True, "documentId": doc_id, "source": "ghost"}

    except Exception as e:
        _log_local_fallback(
            "document",
            {
                "documentType": document_type,
                "fileName": path.name,
                "companyName": company_name,
                "ref": ref,
            },
            {"error": str(e)},
        )
        return {"success": False, "error": str(e)}


def log_error(
    error_message: str,
    document_type: str = "unknown",
    ref: Optional[str] = None,
    company_id: Optional[str] = None,
    error_stack: Optional[str] = None,
    source: Optional[str] = None,
    convex_url: Optional[str] = None,  # ignored
) -> dict:
    """
    Log a document generation error to Ghost.

    Args:
        error_message: The error message.
        document_type: What was being generated when the error occurred.
        ref: Deal reference.
        company_id: Ignored (kept for API compat).
        error_stack: Full stack trace if available.
        source: Script or skill that encountered the error.
        convex_url: Ignored (kept for API compat).

    Returns:
        Dict with {"success": bool, "errorId": int, ...}.
    """
    try:
        conn = _get_connection()
        _ensure_tables(conn)

        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO document_generation_errors
                    (document_type, ref, error_message, error_stack, source)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
                """,
                (document_type, ref, error_message, error_stack, source),
            )
            row = cur.fetchone()
            error_id = row[0] if row else None

        conn.commit()
        conn.close()

        return {"success": True, "errorId": error_id, "source": "ghost"}

    except Exception as e:
        _log_local_fallback(
            "error",
            {"errorMessage": error_message, "documentType": document_type},
            {"error": str(e)},
        )
        return {"success": False, "error": str(e)}


# ── Query helpers (for admin API routes) ────────────────────────────────────


def list_documents(
    company_name: Optional[str] = None,
    limit: int = 100,
) -> list[dict]:
    """List recent documents, optionally filtered by company."""
    conn = _get_connection()
    with conn.cursor() as cur:
        if company_name:
            cur.execute(
                """
                SELECT id, company_name, document_type, file_name, file_path,
                       file_size_bytes, generated_by, ref, status, metadata, created_at
                FROM external_document_log
                WHERE company_name = %s
                ORDER BY created_at DESC
                LIMIT %s
                """,
                (company_name, limit),
            )
        else:
            cur.execute(
                """
                SELECT id, company_name, document_type, file_name, file_path,
                       file_size_bytes, generated_by, ref, status, metadata, created_at
                FROM external_document_log
                ORDER BY created_at DESC
                LIMIT %s
                """,
                (limit,),
            )
        columns = [desc[0] for desc in cur.description]
        rows = [dict(zip(columns, row)) for row in cur.fetchall()]
    conn.close()
    return rows


def list_errors(limit: int = 50) -> list[dict]:
    """List recent errors."""
    conn = _get_connection()
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT id, document_type, ref, error_message, error_stack, source, created_at
            FROM document_generation_errors
            ORDER BY created_at DESC
            LIMIT %s
            """,
            (limit,),
        )
        columns = [desc[0] for desc in cur.description]
        rows = [dict(zip(columns, row)) for row in cur.fetchall()]
    conn.close()
    return rows


def get_document_stats() -> dict:
    """Get document generation statistics."""
    conn = _get_connection()
    with conn.cursor() as cur:
        cur.execute("""
            SELECT
                document_type,
                COUNT(*) as count,
                MAX(created_at) as last_generated
            FROM external_document_log
            GROUP BY document_type
            ORDER BY count DESC
        """)
        by_type = [
            {"type": row[0], "count": row[1], "last_generated": str(row[2])}
            for row in cur.fetchall()
        ]

        cur.execute("SELECT COUNT(*) FROM external_document_log")
        total = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM document_generation_errors")
        error_count = cur.fetchone()[0]

    conn.close()
    return {"total": total, "by_type": by_type, "error_count": error_count}


# ── Fallback ────────────────────────────────────────────────────────────────


def _log_local_fallback(log_type: str, payload: dict, error: dict) -> None:
    """Write a local fallback log when Ghost is unreachable."""
    log_dir = Path(".pi")
    log_dir.mkdir(exist_ok=True)
    log_file = log_dir / "ghost-log-failures.jsonl"

    entry = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "type": log_type,
        "payload": payload,
        "ghost_error": error.get("error", "unknown"),
    }

    with open(log_file, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")


def health_check() -> bool:
    """Check if Ghost is reachable."""
    try:
        conn = _get_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT 1")
        conn.close()
        return True
    except Exception:
        return False


# ── CLI ─────────────────────────────────────────────────────────────────────


def main():
    parser = argparse.ArgumentParser(
        description="Log a generated document to Ghost (PostgreSQL)"
    )
    parser.add_argument(
        "--type", help="Document type (preflight-internal, nda-receipt, etc.)"
    )
    parser.add_argument("--file", help="Path to the generated PDF")
    parser.add_argument("--company", help="Company name")
    parser.add_argument("--ref", help="Deal reference")
    parser.add_argument(
        "--company-id", help="Convex crmCompanies document ID (ignored)"
    )
    parser.add_argument(
        "--generated-by", default="python-script", help="Source script name"
    )
    parser.add_argument("--status", default="generated", help="Document status")
    parser.add_argument("--health", action="store_true", help="Health check only")
    parser.add_argument("--stats", action="store_true", help="Show document stats")

    args = parser.parse_args()

    if args.health:
        ok = health_check()
        print(f"  {'✅' if ok else '❌'} Ghost {'reachable' if ok else 'unreachable'}")
        sys.exit(0 if ok else 1)

    if args.stats:
        stats = get_document_stats()
        print(f"  Total documents: {stats['total']}")
        print(f"  Total errors: {stats['error_count']}")
        print("  By type:")
        for t in stats["by_type"]:
            print(f"    {t['type']}: {t['count']} (last: {t['last_generated']})")
        sys.exit(0)

    if not args.type or not args.file:
        parser.error(
            "--type and --file are required (unless using --health or --stats)"
        )

    result = log_document(
        document_type=args.type,
        file_path=args.file,
        company_name=args.company,
        ref=args.ref,
        generated_by=args.generated_by,
        status=args.status,
    )

    if result.get("success"):
        print(
            f"  ✅ Logged: {Path(args.file).name} → Ghost (id: {result.get('documentId', '?')})"
        )
    else:
        print(f"  ❌ Failed: {result.get('error', 'unknown')}")
        print("     Fallback log written to .pi/ghost-log-failures.jsonl")


if __name__ == "__main__":
    main()
