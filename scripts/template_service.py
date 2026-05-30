#!/usr/bin/env python3
"""
Forhemit Template Service
─────────────────────────
Renders HTML templates with placeholder data, generates PDFs via the
admin's Puppeteer endpoint, and logs to Ghost.

Usage (as library):
    from template_service import render_template, generate_pdf, log_generation

    html = render_template(template_html, {"companyName": "Acme", "ref": "ACM-001"})
    pdf_bytes = generate_pdf(html, "Engagement Letter")

Usage (CLI):
    python3 scripts/template_service.py render --template-id 5 --data '{"companyName":"Acme"}'
    python3 scripts/template_service.py generate --template-id 5 --data '{"companyName":"Acme"}' --output /tmp/out.pdf
"""

import argparse
import base64
import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Optional

# Add scripts dir to path for ghost_logger import
sys.path.insert(0, str(Path(__file__).parent))
from ghost_logger import _get_connection, log_document, log_error

# ── Config ──────────────────────────────────────────────────────────────────

PDF_ENDPOINT = os.environ.get(
    "FORHEMIT_PDF_ENDPOINT", "http://localhost:5050/api/pdf-generate"
)
ADMIN_BASE_URL = os.environ.get("FORHEMIT_ADMIN_URL", "http://localhost:5050")


# ── Template Rendering ──────────────────────────────────────────────────────


def render_template(html: str, data: dict[str, str]) -> str:
    """
    Replace {{placeholders}} and {{#if condition}} blocks with actual values.

    Handles:
    - Simple: {{companyName}}
    - Conditionals: {{#if var}}...{{/if}}
    - Conditionals with else: {{#if var}}...{{else}}...{{/if}}
    """
    result = html

    # Step 1: Handle {{#if var}}...{{/if}} and {{#if var}}...{{else}}...{{/if}}
    if_pattern = re.compile(r"\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}", re.MULTILINE)
    max_iterations = 50
    previous = ""
    while result != previous and max_iterations > 0:
        previous = result
        result = if_pattern.sub(lambda m: _process_if_block(m, data), result)
        max_iterations -= 1

    # Step 2: Replace simple {{placeholder}} with values
    result = re.sub(
        r"\{\{(\w+)\}\}",
        lambda m: data.get(m.group(1), m.group(0)),
        result,
    )

    return result


def _process_if_block(match: re.Match, data: dict[str, str]) -> str:
    """Process a single {{#if var}}...{{/if}} block."""
    var_name = match.group(1)
    block = match.group(2)
    value = data.get(var_name, "")
    is_truthy = value not in ("", "0", "false", None)

    if "{{else}}" in block:
        if_part, else_part = block.split("{{else}}", 1)
        return if_part if is_truthy else else_part
    return block if is_truthy else ""


def build_template_data(
    deal_data: dict[str, str],
    recipient_name: str = "",
    recipient_email: str = "",
) -> dict[str, str]:
    """Build complete data object with defaults for template rendering."""
    now = datetime.now()
    return {
        **deal_data,
        "recipientName": recipient_name,
        "recipientEmail": recipient_email,
        "generatedDate": deal_data.get(
            "generatedDate",
            now.strftime("%B %d, %Y"),
        ),
        "ref": deal_data.get("ref", "FHH-XXXX"),
    }


# ── Template Loading from Ghost ─────────────────────────────────────────────


def load_template_from_ghost(
    template_id: Optional[int] = None, title: Optional[str] = None
) -> Optional[dict]:
    """
    Load a template from Ghost by ID or title.

    Returns dict with keys: id, title, html_content, category, phase, etc.
    """
    conn = _get_connection()
    try:
        with conn.cursor() as cur:
            if template_id:
                cur.execute(
                    "SELECT id, title, html_content, category, phase, step, sort_key, doc_type, priority "
                    "FROM templates WHERE id = %s",
                    (template_id,),
                )
            elif title:
                cur.execute(
                    "SELECT id, title, html_content, category, phase, step, sort_key, doc_type, priority "
                    "FROM templates WHERE title = %s",
                    (title,),
                )
            else:
                return None

            row = cur.fetchone()
            if not row or not cur.description:
                return None

            columns = [desc[0] for desc in cur.description]
            return dict(zip(columns, row))
    finally:
        conn.close()


# ── PDF Generation ──────────────────────────────────────────────────────────


def generate_pdf(
    html_content: str,
    template_name: str,
    pdf_endpoint: Optional[str] = None,
) -> tuple[bytes, int]:
    """
    Generate a PDF from rendered HTML by calling the admin's Puppeteer endpoint.

    Args:
        html_content: Fully rendered HTML string.
        template_name: Display name for the PDF filename.
        pdf_endpoint: Override the default PDF endpoint URL.

    Returns:
        Tuple of (pdf_bytes, pdf_size_bytes).

    Raises:
        RuntimeError: If PDF generation fails.
    """
    import urllib.request
    import urllib.error

    endpoint = pdf_endpoint or PDF_ENDPOINT

    payload = json.dumps(
        {
            "htmlContent": html_content,
            "templateName": template_name,
            "templateId": "python-generated",
            "formData": {},
            "mode": "full",
        }
    ).encode("utf-8")

    req = urllib.request.Request(
        endpoint,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            pdf_bytes = resp.read()
            return pdf_bytes, len(pdf_bytes)
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")[:500]
        raise RuntimeError(f"PDF generation failed ({e.code}): {body}") from e
    except urllib.error.URLError as e:
        raise RuntimeError(f"PDF endpoint unreachable at {endpoint}: {e.reason}") from e


# ── Ghost Logging ───────────────────────────────────────────────────────────


def log_generation(
    template_id: str,
    template_name: str,
    form_data: dict,
    action: str = "generate",
    generated_by: str = "template-service",
    status: str = "success",
) -> dict:
    """
    Log a document generation event to Ghost's document_generations table.

    Args:
        template_id: Template identifier (Ghost ID or form_key).
        template_name: Human-readable template name.
        form_data: The data used to render the template.
        action: What action was performed (generate, pdf-download, email, etc.).
        generated_by: Source of the generation.
        status: Generation status.

    Returns:
        Dict with success status and the new row ID.
    """
    try:
        conn = _get_connection()
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO document_generations
                    (template_id, template_name, form_data, action, generated_by, status)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id
                """,
                (
                    str(template_id),
                    template_name,
                    json.dumps(form_data),
                    action,
                    generated_by,
                    status,
                ),
            )
            row = cur.fetchone()
            gen_id = row[0] if row else None
        conn.commit()
        conn.close()
        return {"success": True, "id": gen_id}
    except Exception as e:
        return {"success": False, "error": str(e)}


# ── High-Level Pipeline ─────────────────────────────────────────────────────


def generate_document(
    template_title: str,
    deal_data: dict[str, str],
    recipient_name: str = "",
    recipient_email: str = "",
    output_path: Optional[str] = None,
    pdf_endpoint: Optional[str] = None,
) -> dict:
    """
    Full pipeline: load template → render → generate PDF → log to Ghost.

    Args:
        template_title: Title of the template in Ghost.
        deal_data: Deal variables for placeholder replacement.
        recipient_name: Recipient's name.
        recipient_email: Recipient's email.
        output_path: If provided, save PDF to this path.
        pdf_endpoint: Override the default PDF endpoint URL.

    Returns:
        Dict with success status, pdf_base64, pdf_size, output_path.
    """
    # 1. Load template from Ghost
    template = load_template_from_ghost(title=template_title)
    if not template:
        return {"success": False, "error": f"Template not found: {template_title}"}

    if not template.get("html_content"):
        return {"success": False, "error": f"Template has no content: {template_title}"}

    # 2. Build data and render
    data = build_template_data(deal_data, recipient_name, recipient_email)
    rendered_html = render_template(template["html_content"], data)

    # 3. Generate PDF
    try:
        pdf_bytes, pdf_size = generate_pdf(rendered_html, template_title, pdf_endpoint)
    except RuntimeError as e:
        # Log error to Ghost
        log_error(
            error_message=str(e),
            document_type=template.get("doc_type", "unknown"),
            ref=deal_data.get("ref"),
            source="template_service",
        )
        return {"success": False, "error": str(e)}

    # 4. Save to file if requested
    saved_path = None
    if output_path:
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "wb") as f:
            f.write(pdf_bytes)
        saved_path = output_path

    # 5. Log to Ghost
    log_result = log_generation(
        template_id=str(template["id"]),
        template_name=template_title,
        form_data=data,
        action="generate",
        generated_by="template-service",
    )

    # Also log to external_document_log for backward compat
    if saved_path:
        log_document(
            document_type=template.get("doc_type", "document"),
            file_path=saved_path,
            company_name=deal_data.get("companyName"),
            ref=deal_data.get("ref"),
            generated_by="template-service",
        )

    return {
        "success": True,
        "pdf_base64": base64.b64encode(pdf_bytes).decode("ascii"),
        "pdf_size": pdf_size,
        "output_path": saved_path,
        "template_id": template["id"],
        "template_version": template.get("step", 1),
        "log_id": log_result.get("id"),
    }


# ── CLI ─────────────────────────────────────────────────────────────────────


def main():
    parser = argparse.ArgumentParser(description="Forhemit Template Service")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # render command
    render_parser = subparsers.add_parser("render", help="Render a template with data")
    render_parser.add_argument("--title", required=True, help="Template title in Ghost")
    render_parser.add_argument(
        "--data", required=True, help="JSON data for placeholders"
    )
    render_parser.add_argument("--output", help="Save rendered HTML to file")

    # generate command
    gen_parser = subparsers.add_parser("generate", help="Generate PDF from template")
    gen_parser.add_argument("--title", required=True, help="Template title in Ghost")
    gen_parser.add_argument("--data", required=True, help="JSON data for placeholders")
    gen_parser.add_argument("--output", help="Save PDF to file")
    gen_parser.add_argument("--pdf-endpoint", help="Override PDF endpoint URL")

    # list command
    list_parser = subparsers.add_parser("list", help="List templates in Ghost")
    list_parser.add_argument("--phase", type=int, help="Filter by workflow phase")
    list_parser.add_argument("--limit", type=int, default=20, help="Max results")

    # health command
    subparsers.add_parser("health", help="Check Ghost connectivity")

    args = parser.parse_args()

    if args.command == "health":
        from ghost_logger import health_check

        ok = health_check()
        print(f"  {'✅' if ok else '❌'} Ghost {'reachable' if ok else 'unreachable'}")
        sys.exit(0 if ok else 1)

    elif args.command == "list":
        conn = _get_connection()
        with conn.cursor() as cur:
            if args.phase:
                cur.execute(
                    "SELECT id, title, doc_type, sort_key, phase, step "
                    "FROM templates WHERE phase = %s ORDER BY sort_key LIMIT %s",
                    (args.phase, args.limit),
                )
            else:
                cur.execute(
                    "SELECT id, title, doc_type, sort_key, phase, step "
                    "FROM templates ORDER BY sort_key LIMIT %s",
                    (args.limit,),
                )
            columns = [desc[0] for desc in cur.description] if cur.description else []
            rows = [dict(zip(columns, row)) for row in cur.fetchall()]
        conn.close()
        for r in rows:
            print(
                f"  {r['sort_key'] or '—':12s}  {r['doc_type'] or '—':15s}  {r['title']}"
            )
        sys.exit(0)

    elif args.command == "render":
        template = load_template_from_ghost(title=args.title)
        if not template:
            print(f"  ❌ Template not found: {args.title}")
            sys.exit(1)
        data = json.loads(args.data)
        rendered = render_template(template["html_content"], data)
        if args.output:
            Path(args.output).parent.mkdir(parents=True, exist_ok=True)
            with open(args.output, "w") as f:
                f.write(rendered)
            print(f"  ✅ Rendered → {args.output}")
        else:
            print(rendered)
        sys.exit(0)

    elif args.command == "generate":
        data = json.loads(args.data)
        result = generate_document(
            template_title=args.title,
            deal_data=data,
            output_path=args.output,
            pdf_endpoint=args.pdf_endpoint,
        )
        if result["success"]:
            print(f"  ✅ PDF generated ({result['pdf_size']} bytes)")
            if result.get("output_path"):
                print(f"     Saved → {result['output_path']}")
        else:
            print(f"  ❌ Failed: {result['error']}")
            sys.exit(1)


if __name__ == "__main__":
    main()
