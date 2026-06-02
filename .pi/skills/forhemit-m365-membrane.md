---
name: forhemit-m365-membrane
description: |
  Connect to Forhemit's Microsoft 365 tenant via Membrane CLI. Covers SharePoint, OneDrive, Outlook, Teams, Box, and GitHub. Use when the agent needs to upload files, send emails, manage documents, post to Teams, or interact with any Forhemit cloud service.
scope: project
when_to_use: |
  When the task involves:
  - Uploading/downloading files from SharePoint or OneDrive
  - Sending emails via Microsoft Outlook
  - Posting messages to Microsoft Teams channels
  - Managing Box.com deal documents
  - Creating GitHub issues
  - Any file management across Forhemit's cloud services
  - Querying SharePoint lists or document libraries
---

# Forhemit Microsoft 365 via Membrane

## Overview

Forhemit uses **Membrane CLI** as the unified auth layer for all cloud services. Membrane handles OAuth token refresh automatically — agents never deal with credentials directly.

**Tenant:** `ForhemitTransition.onmicrosoft.com`
**SharePoint:** `forhemittransition.sharepoint.com`

## Prerequisites

```bash
# Install Membrane CLI (once per machine)
npm install -g @membranehq/cli@latest

# Authenticate (interactive — opens browser)
membrane login --clientName=pi

# If browser redirect doesn't show a code, check the URL bar after redirect
# The code may be embedded in the URL or displayed on the workspace page

# Complete login with the code from the browser
membrane login complete <code>

# Verify
membrane status
```

## Connection IDs (Forhemit Production)

These are the active connection IDs. Use them directly — do NOT create new connections.

| Service | Connection ID | Key |
|---------|---------------|-----|
| **SharePoint** | `6a1db3edda10dd2756d54530` | `microsoft-sharepoint` |
| **OneDrive** | `6a1db4fdda10dd2756d568c1` | `onedrive` |
| **Outlook** | `6a1dba47bd56dac71a73d1f6` | `microsoft-outlook` |
| **Teams** | `6a1dba1bb6a3b237be7a6b03` | `microsoft-teams` |
| **GitHub** | `6a1db9ee9e9e7d2fb34fa950` | `github` |
| **Box** | `6a1db9c73c5084662f988217` | `box` |

**If a connection shows `state: CLIENT_ACTION_REQUIRED`, the user needs to re-authenticate via the `uiUrl` in the response.**

## Command Patterns

### Listing Actions

```bash
# Search for actions by intent
membrane action list --connectionId=<ID> --intent "send email" --limit 5

# Output as JSON
membrane action list --connectionId=<ID> --intent "send email" --limit 5 --json
```

### Running Actions

```bash
# Run with JSON input
membrane action run <actionId> --connectionId=<ID> --input '{"key": "value"}' --json

# Run without input
membrane action run <actionId> --connectionId=<ID> --json
```

### Direct API Calls (Proxy)

```bash
# GET
membrane request <connectionId> /path/to/endpoint --json

# POST with JSON body
membrane request <connectionId> /path -X POST --json -d '{"key": "value"}'

# PUT with file content
membrane request <connectionId> /drives/{driveId}/items/{folderId}:/filename:/content \
  -X PUT -H "Content-Type: text/html" -d "$(cat file.html)" --rawData --json
```

**⚠️ `membrane request` is deprecated but still works. Prefer `membrane action run` when an action exists.**

## Service Reference

### SharePoint

**Site ID:** `forhemittransition.sharepoint.com,2e4aa0c4-42dd-4f84-9b87-d4c94cb3597d,fa7e7423-47e0-4a2b-915d-6713372e0fce`
**Root Drive ID:** `b!xKBKLt1ChE-bh9TJTLNZfSN0fvrgRytKkV1nEzcuD85L6jkQu_34SpPOpOLZ28GV`

**Key Actions:**
| Action | ID | Description |
|--------|-----|-------------|
| List Sites | `6a183c9ad66b7135d66989b9` | List all SharePoint sites |
| Get Site | `6a183c9ad66b7135d669899f` | Get a specific site |
| List Drives | `6a183c9ad66b7135d66989ac` | List document libraries in a site |
| List Drive Items | `6a183c9ad66b7135d6698985` | List files/folders in a drive |
| Create Folder | `6a183c9ad66b7135d669896c` | Create a folder in a drive |
| Get Drive Item | `6a183c9ad66b7135d669895a` | Get file/folder metadata |
| Get File Content | `6a183c99d66b7135d669884d` | Download file content |
| List Lists | `6a183c99d66b7135d66988e9` | List SharePoint lists in a site |
| List List Items | `6a183c99d66b7135d66988b5` | List items in a SharePoint list |
| Create List Item | `6a183c99d66b7135d66988a0` | Create an item in a list |
| List Columns | `6a183c99d66b7135d6698874` | List columns in a list |
| Create List | `6a183c99d66b7135d66988cf` | Create a new SharePoint list |

**Uploading files (no pre-built action — use proxy):**
```bash
DRIVE_ID="b!xKBKLt1ChE-bh9TJTLNZfSN0fvrgRytKkV1nEzcuD85L6jkQu_34SpPOpOLZ28GV"
FOLDER_ID="<target-folder-id>"

# Upload a file (small files <4MB)
membrane request 6a1db3edda10dd2756d54530 \
  "/drives/$DRIVE_ID/items/$FOLDER_ID:/filename.html:/content" \
  -X PUT -H "Content-Type: text/html" \
  -d "$(cat path/to/file.html)" --rawData --json
```

**Folder Structure:**
```
Shared Documents/
└── Forhemit Deals/           (01JUHA5B234GN2PKFTFZE2UPWG32HZEN5A)
    ├── 01-First-Touch/
    ├── 02-Qualification/
    ├── 03-Engagement/
    ├── 04-Diligence/
    ├── 05-Closing/
    ├── 06-Post-Close/
    └── _Templates/            (01JUHA5BYQUUVTLSYPGBCYA36MYAIC5QD7)
        ├── HTML-Previews/     (01JUHA5B2MMZKZXVZON5BY4NXTJKYQJ6NA)
        ├── React-Components/  (01JUHA5B64YTK4SY3K7FAIAXZJM2AUMETB)
        ├── Brand-Assets/      (01JUHA5B2LT7GODTVDOJGLK3LLSBJTLXIN)
        └── Documents/         (01JUHA5B56UZTEQBN5SJFIISYWQBR47KCS)
```

**Document Log List:** `a99d5512-a90a-4c0e-a93f-48932019abd4`
- URL: `https://forhemittransition.sharepoint.com/Lists/Document%20Log`
- Columns: Title, Deal, Stage, DocumentType, Status, Notes

**CRM Lists (Source of Truth):**

| List | ID | Purpose |
|------|-----|----------|
| Companies | `eb4a9da8-c8cf-44e9-9d51-39664fdd73e6` | Deal pipeline — stewardship stages, financials, next actions |
| Contacts | `21b3bbb0-04d0-4ff9-9c28-10a672ede452` | People — owners, brokers, advisors, referral partners |
| Interactions | `706c2bed-c1fc-41e2-853d-225537a33758` | Activity log — calls, meetings, emails, notes |
| Tasks | `924e3e8a-9dec-457b-a2a7-4fca37dd727e` | Follow-ups and action items |
| Document Log | `a99d5512-a90a-4c0e-a93f-48932019abd4` | Tracks all deal documents |

**Architecture:** SharePoint = source of truth. Convex/Ghost = backup/sync.

**Key Columns — Companies:**
Stage, NDAStatus, Ref, Industry, Revenue, EBITDA, OwnerName, BrokerName, NextAction, NextActionDate, ReadinessScore, TrustLevel, NurtureStage, Notes, ConvexId

**Key Columns — Contacts:**
FirstName, LastName, Email, Phone, ContactType, Company, Firm, LastContactDate, NextTouchDate, ContactFrequency, ConvexId

**Key Columns — Interactions:**
InteractionType, CompanyName, ContactName, Summary, Sentiment, InteractionDate, NextAction, NextActionDate

**Key Columns — Tasks:**
Title, CompanyName, DueDate, Priority, TaskStatus, AssignedTo, Description

### OneDrive

**Drive ID:** `b!qk0MguXX1kidxTXdafRBcYDUxWPohPFNs0QYV9TYVqEFFKkEyd4oT6woMDhyByrX`

**Key Actions:**
| Action | ID | Description |
|--------|-----|-------------|
| Get My Drive | `6a155f5ea3a8552fdcb05449` | Get drive properties |
| List Root Items | `6a155f5ea3a8552fdcb05458` | List files/folders at root |
| List Folder Contents | `6a155f5ea3a8552fdcb05467` | List items in a folder |
| Upload Small File | `6a155f5ea3a8552fdcb05431` | Upload file up to 4MB |
| Search Files | `6a155f5ea3a8552fdcb05475` | Search OneDrive files |
| Create Folder | `6a155f5fa3a8552fdcb054e3` | Create a folder |

**Working Files Structure:**
```
OneDrive/
└── Forhemit Working Files/   (01Y2WXMT53QD7LSMTUEJDLDT2JFC52V7DG)
    ├── Drafts/
    ├── Letter Previews/
    └── Meeting Notes/
```

### Outlook

**Key Actions:**
| Action | ID | Description |
|--------|-----|-------------|
| Send Message | `6a183ab4e583162f428cd2b9` | Send email immediately |
| Create Draft | `6a183ab3e583162f428cd29f` | Create a draft email |
| Send Draft | `6a183ab4e583162f428cd2c6` | Send an existing draft |
| Reply to Message | `6a183ab4e583162f428cd2d3` | Reply to sender |
| Reply All | `6a183ab4e583162f428cd2e0` | Reply to all recipients |
| List Messages | `6a183ab3e583162f428cd278` | List mailbox messages |
| List Folder Messages | `6a183ab3e583162f428cd285` | List messages in a folder |
| List Mail Folders | `6a183ab4e583162f428cd314` | List all mail folders |
| List Contacts | `6a183ab4e583162f428cd33b` | List contacts |
| Create Contact | `6a183ab4e583162f428cd355` | Create a contact |
| Update Contact | `6a183ab4e583162f428cd362` | Update a contact |
| Create Mail Folder | `6a183ab4e583162f428cd32e` | Create a mail folder |

**Send Email Example:**
```bash
membrane action run 6a183ab4e583162f428cd2b9 \
  --connectionId=6a1dba47bd56dac71a73d1f6 \
  --input '{
    "subject": "Hello from Forhemit",
    "body": {"contentType": "HTML", "content": "<p>Hello!</p>"},
    "toRecipients": [{"emailAddress": {"address": "recipient@example.com"}}]
  }' --json
```

### Microsoft Teams

**Key Actions:**
| Action | ID | Description |
|--------|-----|-------------|
| List My Joined Teams | `6a072c1d34a1c5a9c190a827` | List teams user belongs to |
| Get Team | `6a072c1d34a1c5a9c190a818` | Get team properties |
| List Team Members | `6a072c1d34a1c5a9c190a6fb` | List members of a team |
| List Channels | `6a072c1d34a1c5a9c190a7dc` | List channels in a team |
| Create Channel | `6a072c1d34a1c5a9c190a7be` | Create a channel |
| Send Chat Message | `6a072c1d34a1c5a9c190a70a` | Send a chat message |
| Send Channel Message | `6a072c1d34a1c5a9c190a773` | Post to a channel |
| Reply to Channel Message | `6a072c1d34a1c5a9c190a764` | Reply to a channel message |

### Box.com

**Key Actions:**
| Action | ID | Description |
|--------|-----|-------------|
| List Folder Items | `6a1830bfc537a9766060a69c` | List files in a folder |
| Search Files | `6a1830bfc537a9766060a6b6` | Search for files |
| Search Folders | `6a1830bfc537a9766060a6c3` | Search for folders |
| List File Comments | `6a1830bec537a9766060a600` | List comments on a file |
| List Folder Collaborations | `6a1830bec537a9766060a5bf` | List collaborations |

### GitHub

**Key Actions:**
| Action | ID | Description |
|--------|-----|-------------|
| Create Issue | `699c56e3454b98ee35ee2b6f` | Create an issue |
| Create Issue Comment | `699c56e3454b98ee35ee2b93` | Comment on an issue |
| Update Issue | `699c56e3454b98ee35ee2b8a` | Update an issue |
| Create Label | `699c56e4454b98ee35ee2c1a` | Create a label |
| Create Repository | `699c56e3454b98ee35ee2be4` | Create a repo |

## Gotchas & Troubleshooting

### 1. Auth Code Doesn't Appear After Browser Redirect

**Symptom:** `membrane login` opens browser, you approve, but no code is shown.
**Fix:** After the redirect, check the URL bar — the code may be embedded in the URL. If you land on a workspace dashboard page, look for a displayed authorization code on the page. If still nothing, try `membrane login start` (without `--tenant`) for a fresh flow.

### 2. `membrane request` Returns Empty Response

**Symptom:** `membrane request` returns `{}` or no data.
**Cause:** The `--rawData` flag with a file path reads the path as a string, not the file content.
**Fix:** Use `-d "$(cat path/to/file)"` with `--rawData` to pipe file content correctly.

### 3. Token Expiration / 401 Errors

**Symptom:** Actions return 401 Unauthorized.
**Cause:** Membrane tokens auto-refresh, but if the connection shows `disconnected: true` or `state: CLIENT_ACTION_REQUIRED`, re-authentication is needed.
**Fix:** Get the `uiUrl` from the connection status response and have the user open it in a browser.

### 4. File Upload Size Limit

**Limit:** Files over 4MB need a resumable upload session (not yet implemented via Membrane proxy).
**Workaround:** For files under 4MB, use the PUT content endpoint. For larger files, split or compress first.

### 5. `membrane request` is Deprecated

The `membrane request` command is deprecated and will be removed. Prefer `membrane action run` with pre-built actions whenever possible. Use the proxy only for operations that don't have a matching action (like file uploads).

### 6. SharePoint Site Creation Requires Admin API Permissions

Creating new SharePoint site collections via Graph API returns 403 with delegated auth (Membrane OAuth). Use the M365 admin center (admin.microsoft.com) to create sites, then manage them via the API.

### 7. Context-Mode Large Output

Membrane action output can be very large (full JSON schemas). If output exceeds 20 lines, context-mode will intercept. Use `--json` and pipe through `python3` or `grep` to extract only what you need.

### 8. Connection State Machine

```
CREATED → BUILDING → CLIENT_ACTION_REQUIRED → READY
                                    ↓
                            CONFIGURATION_ERROR / SETUP_FAILED
```

When state is `CLIENT_ACTION_REQUIRED`, the `clientAction.uiUrl` must be opened by the user. Don't poll until the user confirms they've completed the action.

### 9. Multiple Connections to Same Service

Membrane allows multiple connections to the same service (via `--alias`). For Forhemit, use the connection IDs listed above — don't create duplicates.

### 10. `membrane connection get --wait` for Long Polling

```bash
membrane connection get <id> --wait --timeout 30 --json
```
Use `--wait` to long-poll until state changes. Useful for waiting on user auth completion.

## Service Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Membrane CLI                        │
│            (Auth + API Proxy Layer)                  │
├──────────┬──────────┬──────────┬──────────┬─────────┤
│SharePoint│ OneDrive │ Outlook  │  Teams   │  Box    │
│(storage) │(personal)│ (email)  │(collab)  │(signing)│
├──────────┴──────────┴──────────┴──────────┴─────────┤
│              ForhemitTransition.onmicrosoft.com       │
└─────────────────────────────────────────────────────┘
```

**How services work together:**
- **SharePoint** — Templates, brand assets, deal document storage, CRM lists
- **OneDrive** — Personal working files, drafts, letter previews
- **Outlook** — Client email, scheduling, contact management
- **Teams** — Internal collaboration, channel notifications
- **Box** — Deal folder structure, document signing (Box Sign)
- **GitHub** — Issue tracking, code management
