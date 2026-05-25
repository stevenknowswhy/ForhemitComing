#!/usr/bin/env /Library/Frameworks/Python.framework/Versions/3.11/bin/python3
"""
Upload all Forhemit HTML templates to Documenso as PDFs.

Steps:
1. Parse manifest.ts for template metadata
2. Scan all HTML files on disk
3. Create folder hierarchy in Documenso
4. Generate PDFs via Playwright Chromium
5. Upload PDFs as Documenso templates via V2 API
6. Track progress for resume support

Usage:
    python3 scripts/upload-templates-to-documenso.py --dry-run   # Preview only
    python3 scripts/upload-templates-to-documenso.py              # Full upload
    python3 scripts/upload-templates-to-documenso.py --resume     # Resume interrupted upload
"""

import argparse
import json
import os
import re
import sys
import tempfile
import time
from pathlib import Path

import requests

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

API_BASE = "https://docs.forhemit.com/api/v2"
API_TOKEN = os.environ.get("DOCUMENSO_API_TOKEN", "api_uk3lmmlsv18sw3vv")
TEMPLATES_DIR = Path(__file__).resolve().parent.parent / "packages" / "convex" / "templates"
PROGRESS_FILE = Path(__file__).resolve().parent / "upload-progress.json"

HEADERS = {
    "Authorization": f"Bearer {API_TOKEN}",
}

# Stage display names
STAGE_NAMES = {
    "01-first-touch": "01 - First Touch",
    "02-qualification": "02 - Qualification",
    "03-engagement": "03 - Engagement",
    "04-diligence": "04 - Diligence",
    "05-closing": "05 - Closing",
    "06-post-close": "06 - Post-Close",
}

# ---------------------------------------------------------------------------
# Manifest parsing
# ---------------------------------------------------------------------------

def parse_manifest() -> dict[str, dict]:
    """Parse manifest.ts and return {resolved_path: {id, name, stage, pipeline, audience}}."""
    manifest_path = TEMPLATES_DIR / "manifest.ts"
    if not manifest_path.exists():
        print(f"Warning: manifest not found at {manifest_path}")
        return {}

    content = manifest_path.read_text()
    entries = {}

    # Match each template block: "key": { ... }
    pattern = re.compile(
        r'"((?:external|internal)/[^"]+)":\s*\{([^}]+)\}',
        re.DOTALL,
    )
    for match in pattern.finditer(content):
        entry_id = match.group(1)
        body = match.group(2)

        path_m = re.search(r'path:\s*"(\./[^"]+)"', body)
        name_m = re.search(r'name:\s*"([^"]+)"', body)
        stage_m = re.search(r'stage:\s*"([^"]+)"', body)
        pipeline_m = re.search(r'pipeline:\s*"([^"]+)"', body)
        audience_m = re.search(r'audience:\s*\[([^\]]*)\]', body)

        if not path_m:
            continue

        resolved = (TEMPLATES_DIR / path_m.group(1).lstrip("./")).resolve()
        audience = []
        if audience_m:
            audience = [a.strip().strip('"') for a in audience_m.group(1).split(",") if a.strip()]

        entries[str(resolved)] = {
            "id": entry_id,
            "name": name_m.group(1) if name_m else entry_id.split("/")[-1].replace("-", " ").title(),
            "stage": stage_m.group(1) if stage_m else entry_id.split("/")[1] if len(entry_id.split("/")) > 1 else "unknown",
            "pipeline": pipeline_m.group(1) if pipeline_m else entry_id.split("/")[0],
            "audience": audience,
        }

    return entries


def scan_html_files() -> list[Path]:
    """Find all HTML template files on disk, excluding shared/."""
    files = []
    for root, dirs, filenames in os.walk(TEMPLATES_DIR):
        if "shared" in root:
            continue
        for f in filenames:
            if f.endswith(".html"):
                files.append(Path(root) / f)
    return sorted(files)


def build_template_list(manifest: dict[str, dict], html_files: list[Path]) -> list[dict]:
    """Build unified list of templates with metadata."""
    templates = []
    for html_path in html_files:
        path_str = str(html_path)
        rel = html_path.relative_to(TEMPLATES_DIR)
        parts = rel.parts  # e.g., ("external", "02-qualification", "file.html")

        if path_str in manifest:
            meta = manifest[path_str]
        else:
            # Derive metadata from path
            pipeline = parts[0] if len(parts) >= 2 else "external"
            stage = parts[1] if len(parts) >= 2 else "unknown"
            name = html_path.stem.replace("-", " ").replace("_", " ").title()
            meta = {
                "id": str(rel),
                "name": name,
                "stage": stage,
                "pipeline": pipeline,
                "audience": [],
            }

        templates.append({
            "html_path": html_path,
            "id": meta["id"],
            "name": meta["name"],
            "stage": meta["stage"],
            "pipeline": meta["pipeline"],
            "audience": meta.get("audience", []),
        })

    return templates


# ---------------------------------------------------------------------------
# Documenso API
# ---------------------------------------------------------------------------

def api_get(path: str, params: dict | None = None) -> dict:
    resp = requests.get(f"{API_BASE}{path}", headers=HEADERS, params=params, timeout=30)
    resp.raise_for_status()
    return resp.json()


def api_post_json(path: str, data: dict) -> dict:
    resp = requests.post(
        f"{API_BASE}{path}",
        headers={**HEADERS, "Content-Type": "application/json"},
        json=data,
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()


def api_post_multipart(path: str, payload: dict, file_path: Path) -> dict:
    with open(file_path, "rb") as f:
        resp = requests.post(
            f"{API_BASE}{path}",
            headers=HEADERS,
            data={"payload": json.dumps(payload)},
            files={"file": (file_path.name, f, "application/pdf")},
            timeout=120,
        )
    resp.raise_for_status()
    return resp.json()


def get_existing_folders() -> list[dict]:
    """Get all existing folders."""
    folders = []
    page = 1
    while True:
        data = api_get("/folder", {"page": page, "perPage": 100})
        folders.extend(data.get("data", []))
        if page >= data.get("totalPages", 1):
            break
        page += 1
    return folders


def get_existing_templates() -> list[dict]:
    """Get all existing templates."""
    templates = []
    page = 1
    while True:
        data = api_get("/template", {"page": page, "perPage": 100})
        templates.extend(data.get("data", []))
        if page >= data.get("totalPages", 1):
            break
        page += 1
    return templates


# ---------------------------------------------------------------------------
# Folder hierarchy
# ---------------------------------------------------------------------------

def create_folder_hierarchy(dry_run: bool = False) -> dict[str, str]:
    """
    Create the folder hierarchy and return {folder_key: folder_id}.

    Structure:
        Forhemit Templates/
        ├── External/
        │   ├── 01 - First Touch/
        │   ├── 02 - Qualification/
        │   ...
        └── Internal/
            ├── 01 - First Touch/
            ...
    """
    existing = get_existing_folders()
    existing_map = {f["name"]: f for f in existing}

    folder_ids: dict[str, str] = {}

    def get_or_create(name: str, parent_id: str | None = None, folder_type: str = "TEMPLATE") -> str:
        # Check if exists
        for f in existing:
            if f["name"] == name and f.get("parentId") == parent_id:
                return f["id"]

        if dry_run:
            fake_id = f"dry-run-{name.lower().replace(' ', '-')}"
            print(f"  [DRY] Would create folder: {name} (parent={parent_id})")
            return fake_id

        result = api_post_json("/folder/create", {
            "name": name,
            "type": folder_type,
            **({"parentId": parent_id} if parent_id else {}),
        })
        folder_id = result["id"]
        existing.append(result)  # Add to local cache
        print(f"  Created folder: {name} -> {folder_id}")
        return folder_id

    # Root
    root_id = get_or_create("Forhemit Templates")

    for pipeline in ["External", "Internal"]:
        pipe_id = get_or_create(pipeline, root_id)
        folder_ids[pipeline.lower()] = pipe_id

        for stage_key, stage_name in STAGE_NAMES.items():
            stage_id = get_or_create(stage_name, pipe_id)
            folder_ids[f"{pipeline.lower()}/{stage_key}"] = stage_id

    return folder_ids


# ---------------------------------------------------------------------------
# PDF generation
# ---------------------------------------------------------------------------

def generate_pdf(html_path: Path, output_path: Path, playwright_page) -> bool:
    """Generate PDF from HTML template using Playwright."""
    try:
        file_url = f"file://{html_path}"
        playwright_page.goto(file_url, wait_until="networkidle", timeout=30000)
        # Wait for fonts to load
        playwright_page.wait_for_timeout(1000)
        playwright_page.pdf(
            path=str(output_path),
            format="A4",
            print_background=True,
            margin={"top": "0.5in", "bottom": "0.5in", "left": "0.5in", "right": "0.5in"},
        )
        return True
    except Exception as e:
        print(f"    PDF generation failed: {e}")
        return False


# ---------------------------------------------------------------------------
# Progress tracking
# ---------------------------------------------------------------------------

def load_progress() -> dict:
    if PROGRESS_FILE.exists():
        return json.loads(PROGRESS_FILE.read_text())
    return {}


def save_progress(progress: dict):
    PROGRESS_FILE.write_text(json.dumps(progress, indent=2))


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Upload Forhemit templates to Documenso")
    parser.add_argument("--dry-run", action="store_true", help="Preview without making API calls")
    parser.add_argument("--resume", action="store_true", help="Skip already-uploaded templates")
    parser.add_argument("--limit", type=int, default=0, help="Limit number of templates (0 = all)")
    parser.add_argument("--start", type=int, default=0, help="Start from this index (0-based)")
    args = parser.parse_args()

    print("=" * 60)
    print("Forhemit Template Upload to Documenso")
    print("=" * 60)

    # Step 1: Parse manifest and scan files
    print("\n[1/4] Parsing manifest and scanning HTML files...")
    manifest = parse_manifest()
    html_files = scan_html_files()
    templates = build_template_list(manifest, html_files)

    print(f"  Manifest entries: {len(manifest)}")
    print(f"  HTML files on disk: {len(html_files)}")
    print(f"  Templates to process: {len(templates)}")

    # Step 2: Create folder hierarchy
    print("\n[2/4] Creating folder hierarchy...")
    folder_ids = create_folder_hierarchy(dry_run=args.dry_run)
    print(f"  Folders ready: {len(folder_ids)}")

    # Step 3: Generate PDFs and upload
    print("\n[3/4] Generating PDFs and uploading templates...")

    progress = load_progress() if args.resume else {}
    success_count = 0
    fail_count = 0
    skip_count = 0

    # Slice templates
    work = templates[args.start:]
    if args.limit > 0:
        work = work[:args.limit]

    # Import playwright
    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        for i, tmpl in enumerate(work):
            idx = args.start + i
            tmpl_id = tmpl["id"]

            # Check if already uploaded
            if args.resume and tmpl_id in progress and progress[tmpl_id].get("status") == "success":
                skip_count += 1
                continue

            # Determine folder
            folder_key = f"{tmpl['pipeline']}/{tmpl['stage']}"
            folder_id = folder_ids.get(folder_key)
            if not folder_id:
                print(f"  [{idx+1}/{len(templates)}] SKIP (no folder): {tmpl['name']}")
                progress[tmpl_id] = {"status": "skipped", "reason": "no folder"}
                fail_count += 1
                continue

            print(f"  [{idx+1}/{len(templates)}] {tmpl['name']}...", end=" ", flush=True)

            if args.dry_run:
                print("(dry run)")
                success_count += 1
                continue

            # Generate PDF
            with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
                pdf_path = Path(tmp.name)

            try:
                if not generate_pdf(tmpl["html_path"], pdf_path, page):
                    progress[tmpl_id] = {"status": "failed", "error": "PDF generation failed"}
                    fail_count += 1
                    print("FAIL (PDF)")
                    continue

                # Upload to Documenso
                result = api_post_multipart("/template/create", {
                    "title": tmpl["name"],
                    "folderId": folder_id,
                    "externalId": tmpl_id,
                    "visibility": "EVERYONE",
                    "type": "ORGANISATION",
                }, pdf_path)

                documenso_id = result.get("id", "unknown")
                progress[tmpl_id] = {
                    "status": "success",
                    "documenso_id": documenso_id,
                    "name": tmpl["name"],
                    "folder": folder_key,
                }
                success_count += 1
                print(f"OK (id={documenso_id})")

            except requests.HTTPError as e:
                error_msg = str(e)
                try:
                    error_msg = e.response.json().get("message", str(e))
                except Exception:
                    pass
                progress[tmpl_id] = {"status": "failed", "error": error_msg}
                fail_count += 1
                print(f"FAIL ({error_msg})")

            except Exception as e:
                progress[tmpl_id] = {"status": "failed", "error": str(e)}
                fail_count += 1
                print(f"FAIL ({e})")

            finally:
                # Clean up temp PDF
                if pdf_path.exists():
                    pdf_path.unlink()

            # Save progress periodically
            if (i + 1) % 10 == 0:
                save_progress(progress)

            # Rate limit: small delay between uploads
            time.sleep(0.5)

        browser.close()

    # Save final progress
    if not args.dry_run:
        save_progress(progress)

    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"  Success: {success_count}")
    print(f"  Failed:  {fail_count}")
    print(f"  Skipped: {skip_count}")
    print(f"  Total:   {len(work)}")

    if fail_count > 0:
        print(f"\nFailed templates:")
        for tid, info in progress.items():
            if info.get("status") == "failed":
                print(f"  - {tid}: {info.get('error', 'unknown')}")


if __name__ == "__main__":
    main()
