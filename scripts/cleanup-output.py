#!/usr/bin/env python3
"""
Forhemit Output Cleanup
───────────────────────
Removes all non-PDF files from the output folder, keeping only
the final usable PDF documents. Safe by default — uses dry-run
unless --confirm is passed.

Usage:
  python3 scripts/cleanup-output.py /path/to/folder/output          # preview
  python3 scripts/cleanup-output.py /path/to/folder/output --confirm # delete
"""

import argparse
import sys
from pathlib import Path


def cleanup_output(output_dir: Path, confirm: bool = False) -> None:
    if not output_dir.exists():
        print(f"\n  ERROR: Directory not found: {output_dir}\n")
        sys.exit(1)

    all_files = sorted(f for f in output_dir.iterdir() if f.is_file())
    pdfs = [f for f in all_files if f.suffix.lower() == ".pdf"]
    deletions = [f for f in all_files if f.suffix.lower() != ".pdf"]

    print(f"\n  Output: {output_dir}")
    print(f"  PDFs to keep:    {len(pdfs)}")
    print(f"  Files to remove: {len(deletions)}\n")

    if not deletions:
        print("  Nothing to clean up — output folder contains only PDFs.\n")
        return

    for f in deletions:
        size = f.stat().st_size
        label = f"{size / 1024:.0f} KB" if size > 1024 else f"{size} B"
        if confirm:
            f.unlink()
            print(f"  🗑  {f.name}  ({label})  deleted")
        else:
            print(f"  🗑  {f.name}  ({label})  [would delete]")

    count = len(deletions)
    if not confirm:
        print(f"\n  Dry run. Re-run with --confirm to delete {count} file(s).\n")
    else:
        print(f"\n  ✅ Removed {count} file(s). {len(pdfs)} PDF(s) remain.\n")


def main():
    parser = argparse.ArgumentParser(
        description="Clean up output folder — keep only PDFs"
    )
    parser.add_argument(
        "output_dir",
        type=str,
        help="Path to the output folder (e.g., /path/to/client/output)",
    )
    parser.add_argument(
        "--confirm",
        action="store_true",
        help="Actually delete files. Without this flag, runs in dry-run mode.",
    )

    args = parser.parse_args()
    cleanup_output(Path(args.output_dir).resolve(), confirm=args.confirm)


if __name__ == "__main__":
    main()
