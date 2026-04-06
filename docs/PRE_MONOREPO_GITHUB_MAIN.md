# Pre–force-push GitHub `main` history

After the workspace became the canonical `main` on GitHub, the **previous** `main` branch tip was commit **`83a1504`** (“Set default theme to light mode”), with history going back through **`bf6b12c`** (“remove admin functionality, prepare for marketing-only deployment”) and earlier.

## Do we still need those commits?

**No additional merge or cherry-pick was required** for the marketing app under `ForhemitComing-main/`.

A byte-for-byte comparison showed that for **every path that exists in both trees**, files under **`ForhemitComing-main/`** match **`83a1504:<path>`**. The workspace that was committed in the initial monorepo import already reflected the same marketing codebase as the old GitHub `main` tip.

The only structural difference vs that old tree is intentional: **`utils/uploadthing.ts`** was replaced by **`lib/uploads/client.ts`** (UploadThing abstraction per harmonization plan).

## Permanent bookmark

To keep the old tip reachable forever (even after local reflog expires), a tag points at that commit:

- **Tag:** `pre-monorepo-github-main` → **`83a1504`**

```bash
git show pre-monorepo-github-main
git log --oneline -20 pre-monorepo-github-main
```

## Recovering an individual file later

If you ever need a file exactly as it was on old `main`:

```bash
git show 83a1504:app/page.tsx   # old repo root path
# Compare or copy into ForhemitComing-main/app/page.tsx as needed
```

## Full old history (large)

The range **`bf6b12c..83a1504`** touches hundreds of files (not only theme tweaks). The **last** commit **`83a1504`** itself is broad; earlier commits in the chain include smaller CSS-only changes. All of that content is already represented in **`ForhemitComing-main/`** as of the verified snapshot above.
