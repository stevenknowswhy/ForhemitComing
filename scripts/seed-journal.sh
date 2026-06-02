#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# seed-journal.sh — Seed a fully-populated transition journal with Box folders
#
# Prerequisites:
#   - Convex dev server running (pnpm convex:dev in packages/convex)
#   - Admin dev server running (pnpm dev in apps/admin) for PDF generation
#   - Box credentials configured in Convex env vars
#
# Usage:
#   cd /Users/stephenstokes/Workspace/Projects/Forhemit
#   bash scripts/seed-journal.sh
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

CONVEX_DIR="$(cd "$(dirname "$0")/../packages/convex" && pwd)"

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  Forhemit — Transition Journal Seed                         ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# ── Step 1: Seed demo data in Convex ─────────────────────────────────────────
echo "📦 Step 1/5: Creating demo company, journal, chapters, entries..."
echo ""

SEED_RESULT=$(cd "$CONVEX_DIR" && npx convex run journalSeed:seedTransitionJournal 2>&1)
echo "$SEED_RESULT"

# Extract journalId from the result
JOURNAL_ID=$(echo "$SEED_RESULT" | grep -o '"journalId": "[^"]*"' | head -1 | cut -d'"' -f4)
COMPANY_NAME=$(echo "$SEED_RESULT" | grep -o '"companyName": "[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$JOURNAL_ID" ]; then
	echo "❌ Failed to extract journal ID from seed result"
	echo "   Make sure Convex dev server is running: cd packages/convex && pnpm convex:dev"
	exit 1
fi

echo ""
echo "✅ Seeded: $COMPANY_NAME"
echo "   Journal ID: $JOURNAL_ID"
echo ""

# ── Step 2: Provision Box folder structure ───────────────────────────────────
echo "📁 Step 2/5: Provisioning Box folder structure..."
echo ""

PROVISION_RESULT=$(cd "$CONVEX_DIR" && npx convex run journalBox:provisionJournalBox "{\"journalId\": \"$JOURNAL_ID\", \"companyName\": \"$COMPANY_NAME\", \"journalType\": \"transition\"}" 2>&1)
echo "$PROVISION_RESULT"

echo ""
echo "✅ Box folders created"
echo ""

# ── Step 3: Upload Welcome documents ────────────────────────────────────────
echo "📄 Step 3/5: Generating and uploading Welcome documents..."
echo ""

WELCOME_RESULT=$(cd "$CONVEX_DIR" && npx convex run journalBox:uploadWelcomeDocs "{\"journalId\": \"$JOURNAL_ID\", \"boxFolderId\": \"$(echo $PROVISION_RESULT | grep -o '"rootFolderId": "[^"]*"' | head -1 | cut -d'\"' -f4)\", \"companyName\": \"$COMPANY_NAME\"}" 2>&1)
echo "$WELCOME_RESULT"

echo ""
echo "✅ Welcome documents uploaded"
echo ""

# ── Step 4: Upload phase checklists (Ignition + Build) ──────────────────────
echo "📋 Step 4/5: Generating phase checklists..."
echo ""

for PHASE in ignition build; do
	echo "  → $PHASE checklist..."
	CHECKLIST_RESULT=$(cd "$CONVEX_DIR" && npx convex run journalBox:uploadPhaseChecklist "{\"journalId\": \"$JOURNAL_ID\", \"phase\": \"$PHASE\", \"boxFolderId\": \"$(echo $PROVISION_RESULT | grep -o '"rootFolderId": "[^"]*"' | head -1 | cut -d'\"' -f4)\", \"companyName\": \"$COMPANY_NAME\"}" 2>&1)
	echo "  $CHECKLIST_RESULT"
done

echo ""
echo "✅ Phase checklists uploaded"
echo ""

# ── Step 5: Generate journal digests for both weeks ──────────────────────────
echo "📔 Step 5/5: Generating journal digest PDFs..."
echo ""

# Calculate week timestamps
THIS_WEEK=$(node -e "
const d = new Date();
const day = d.getDay();
const diff = d.getDate() - day + (day === 0 ? -6 : 1);
d.setDate(diff);
d.setHours(0,0,0,0);
console.log(d.getTime());
")

LAST_WEEK=$(node -e "
const d = new Date();
const day = d.getDay();
const diff = d.getDate() - day + (day === 0 ? -6 : 1);
d.setDate(diff);
d.setHours(0,0,0,0);
console.log(d.getTime() - 7 * 86400000);
")

echo "  → Last week's digest (Chapter 1: Ignition)..."
DIGEST_1=$(cd "$CONVEX_DIR" && npx convex run journalPdf:generateJournalDigest "{\"journalId\": \"$JOURNAL_ID\", \"weekStarting\": $LAST_WEEK, \"force\": true}" 2>&1)
echo "  $DIGEST_1"

echo "  → This week's digest (Chapter 2: Build)..."
DIGEST_2=$(cd "$CONVEX_DIR" && npx convex run journalPdf:generateJournalDigest "{\"journalId\": \"$JOURNAL_ID\", \"weekStarting\": $THIS_WEEK, \"force\": true}" 2>&1)
echo "  $DIGEST_2"

echo ""
echo "✅ Journal digests generated"
echo ""

# ── Done ─────────────────────────────────────────────────────────────────────
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  ✅ Seed Complete!                                          ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "  Company:   $COMPANY_NAME"
echo "  Journal:   http://localhost:5050/admin/journals/$JOURNAL_ID"
echo ""
echo "  Box folder structure:"
echo "    📁 $COMPANY_NAME — ESOP Transition"
echo "    ├── 📁 00 — Welcome"
echo "    │   └── 📄 Welcome to Your ESOP Transition.pdf"
echo "    ├── 📁 01 — Ignition (Days 1–14)"
echo "    │   ├── 📄 Phase Overview & Checklist.pdf"
echo "    │   ├── 📁 Documents"
echo "    │   └── 📁 Journal"
echo "    │       └── 📄 Journal_Week_$(date -d @$LAST_WEEK +%Y-%m-%d 2>/dev/null || date -r $LAST_WEEK +%Y-%m-%d).pdf"
echo "    ├── 📁 02 — Build (Days 15–45)"
echo "    │   ├── 📄 Phase Overview & Checklist.pdf"
echo "    │   ├── 📁 Documents"
echo "    │   └── 📁 Journal"
echo "    │       └── 📄 Journal_Week_$(date -d @$THIS_WEEK +%Y-%m-%d 2>/dev/null || date -r $THIS_WEEK +%Y-%m-%d).pdf"
echo "    ├── 📁 03 — Validate (Days 46–75)"
echo "    ├── 📁 04 — Close Prep (Days 76–105)"
echo "    ├── 📁 05 — Closing (Days 106–120)"
echo "    └── 📁 06 — Post-Close"
echo ""
echo "  Cron: Daily checklist sync runs at 2:00 AM PST"
echo "  Cron: Weekly journal digest runs every Tuesday at 2:00 AM PST"
echo ""
