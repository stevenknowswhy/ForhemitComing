06/02/26 10:36 AM PT
06/02/26 10:34 AM PT
06/02/26 10:31 AM PT
06/02/26 10:28 AM PT
Purpose: (auto-inserted by pre-commit — please update)

# Microsoft 365 Migration Plan — Forhemit

**Tenant:** `ForhemitTransition.onmicrosoft.com`
**License:** Microsoft 365 Business Premium
**Domain:** `.onmicrosoft.com` (no custom domain yet)
**Users:** 1 (Stefano) — expanding later
**Goal:** Move local drive files (templates, working documents, deal files) to SharePoint/OneDrive so you can work from anywhere. Box.com stays as-is for deal document management and signing. Both systems work together.

---

## Current State

### What Exists Today
| System | What's There | Location |
|--------|-------------|----------|
| **Local Drive** | Letter templates (HTML previews, PDFs), deal documents, client files | `~/Workspace/Projects/Forhemit/apps/admin/app/admin/letters/` + templates |
| **Box.com** | Per-deal folder structure, stage subfolders, uploaded PDFs, signed documents | Box root: `Forhemit Deals/` folder hierarchy |
| **Convex** | Document metadata, business log events, deal tracking | `packages/convex/convex/box.ts` + `lib/box.ts` |
| **App (letters)** | 6 letter templates (Intro, Preliminary Review, Broker Intro, Broker Tear Sheet, Engagement, Quick Send) | `apps/admin/app/admin/letters/components/` |

### Box.com Folder Structure (Current)
```
Forhemit Deals/
├── {Company Name} ({ref})/
│   ├── 01-first-touch/
│   ├── 02-qualification/
│   ├── 03-engagement/
│   ├── 04-diligence/
│   ├── 05-closing/
│   └── 06-post-close/
```

---

## Target State — SharePoint Architecture

### Why SharePoint Over OneDrive for Deals
- **SharePoint** = team-accessible, structured, auditable, permission-controlled → deal documents
- **OneDrive** = personal working files, drafts, individual storage → working files

### Proposed SharePoint Site Structure

```
Forhemit SharePoint (Site: "Forhemit Deals")
│
├── 📁 Document Library: "Deal Documents"
│   ├── 📁 {Company Name}/
│   │   ├── 📁 01-First-Touch/
│   │   │   ├── Introduction Letter - {date}.pdf
│   │   │   ├── NDA - {date}.pdf
│   │   │   └── Broker Introduction - {date}.pdf
│   │   ├── 📁 02-Qualification/
│   │   │   ├── Preliminary Review - {date}.pdf
│   │   │   ├── Feasibility Assessment - {date}.pdf
│   │   │   └── Engagement Letter - {date}.pdf
│   │   ├── 📁 03-Engagement/
│   │   │   ├── Term Sheet - {date}.pdf
│   │   │   └── LOI - {date}.pdf
│   │   ├── 📁 04-Diligence/
│   │   │   ├── QofE Report - {date}.pdf
│   │   │   ├── FMV Appraisal - {date}.pdf
│   │   │   └── SBA Package - {date}.pdf
│   │   ├── 📁 05-Closing/
│   │   │   ├── Board Resolutions - {date}.pdf
│   │   │   ├── ERISA Review - {date}.pdf
│   │   │   └── Wire Instructions - {date}.pdf
│   │   └── 📁 06-Post-Close/
│   │       └── Transition Docs - {date}.pdf
│   └── 📁 _Templates/
│       ├── Introduction Letter Template.html
│       ├── Preliminary Review Template.html
│       ├── Broker Introduction Template.html
│       ├── Broker Tear Sheet Template.html
│       ├── Engagement Letter Template.html
│       └── Quick Send Template.html
│
├── 📋 SharePoint List: "Document Log"
│   (complements Box.com signing audit trail)
│   ├── Title (auto: filename)
│   ├── Deal (lookup → CRM company)
│   ├── Stage (choice: 1-6)
│   ├── Document Type (choice: NDA, Letter, Report, etc.)
│   ├── Uploaded By (person)
│   ├── Upload Date (date)
│   ├── Status (choice: Draft, Sent, Signed, Filed)
│   └── SharePoint URL (auto)
│
└── 📁 Document Library: "Internal"
    ├── 📁 Templates (master copies)
    ├── 📁 Brand Assets (logos, fonts, CSS)
    └── 📁 Compliance (retention policies)
```

### OneDrive (Personal)
```
OneDrive/
├── 📁 Forhemit Working Files/
│   ├── 📁 Drafts/
│   ├── 📁 Letter Previews (HTML)/
│   └── 📁 Meeting Notes/
```

---

## Available Tools & Skills

### Installed Skills (3)
| Skill | What It Does | Auth Method |
|-------|-------------|-------------|
| **microsoft-sharepoint** | Sites, lists, files, folders via Membrane CLI | Membrane OAuth |
| **onedrive** | Personal file management, search, upload, sharing | Membrane OAuth |
| **microsoft-graph-api** | Unified M365 API — users, mail, calendar, drive, groups | Membrane OAuth |
| **ms365-tenant-manager** | PowerShell scripts for tenant admin, security, users | Direct PowerShell |

### Additional Tools
| Tool | What It Does | Status |
|------|-------------|--------|
| **Composio CLI** | Microsoft 365 toolkit integrations | Authenticated (needs re-link for M365) |
| **Membrane CLI** | Auth-managed API proxy for SharePoint/OneDrive/Graph | Needs install + auth |

---

## Migration Phases

### Phase 0: Foundation (Week 1)
**Goal:** Set up the Microsoft 365 tenant properly before touching any files.

#### 0.1 — Tenant Security Baseline
- [ ] Confirm Global Admin access to `ForhemitTransition.onmicrosoft.com`
- [ ] Enable MFA for all users (report-only first, enforce after 48h)
- [ ] Block legacy authentication (Basic Auth protocols)
- [ ] Enable unified audit logging
- [ ] Review Microsoft Secure Score baseline
- [ ] Set up Conditional Access policy (named locations, trusted devices)

#### 0.2 — Install & Configure Tools
- [ ] Install Membrane CLI: `npm install -g @membranehq/cli@latest`
- [ ] Authenticate: `membrane login --tenant --clientName=pi`
- [ ] Create SharePoint connection: `membrane connection ensure "https://microsoft.sharepoint.com/" --json`
- [ ] Create OneDrive connection: `membrane connection ensure "https://onedrive.live.com/login/" --json`
- [ ] Upgrade Composio: `composio upgrade`
- [ ] Link Composio to M365: `composio link sharepoint`

#### 0.3 — DNS & Domain Verification
- [ ] Verify custom domain (if applicable) in M365 admin center
- [ ] Configure SPF, DKIM, DMARC records for email deliverability
- [ ] Wait for DNS propagation (up to 48h)

---

### Phase 1: SharePoint Site Setup (Week 1-2)
**Goal:** Create the document library structure and configure permissions.

#### 1.1 — Create SharePoint Site
- [ ] Create site "Forhemit Deals" via Membrane or M365 admin center
- [ ] Configure site permissions (who can access, edit, admin)
- [ ] Set up document library "Deal Documents" with folder structure

#### 1.2 — Create Document Metadata
- [ ] Create SharePoint List "Document Log" with columns:
  - Deal (text or lookup)
  - Stage (choice: First-Touch, Qualification, Engagement, Diligence, Closing, Post-Close)
  - Document Type (choice: NDA, Letter, Report, Term Sheet, LOI, etc.)
  - Status (choice: Draft, Sent, Signed, Filed)
  - Upload Date (date)
  - Notes (text)

#### 1.3 — Configure Retention & Compliance
- [ ] Set retention policy: Activity documents = 3yr, Compliance documents = 7yr
- [ ] Enable version history on document library
- [ ] Configure audit logging for document access

#### 1.4 — Permissions Model
| Role | SharePoint Permission | Who |
|------|----------------------|-----|
| Admin (Stefano) | Full Control | Site owner |
| Team Member | Contribute | Future employees |
| Client (external) | Read (specific folder only) | Via guest link or Azure B2B |

---

### Phase 2: Template Migration (Week 2)
**Goal:** Move letter templates to SharePoint and verify they work from the cloud.

#### 2.1 — Upload Master Templates ✅ DONE (2026-06-01)
- [x] `introduction-letter.html` (15.8KB)
- [x] `preliminary-review.html` (15.9KB)
- [x] `preview.html` (33KB, combined preview with tab switching)
- [x] `engagement-letter-v3.html` (110KB)
- [x] `BrokerIntroductionEmail.tsx/.css` (59.8KB + 19KB)
- [x] `BrokerTearSheet.tsx/.css` (29.7KB + 20KB)
- [x] `ClientIntroductionLetter.tsx/.css` (29.7KB + 11.2KB)
- [x] `PreliminaryReviewLetter.tsx/.css` (30.9KB + 11KB)
- [x] `QuickSendEngagementLetter.tsx/.css` (33.6KB + 10.8KB)
- [x] `letters.css` (1.7KB)
- [x] Additional HTML docs: 120-day tracker, affiliate curriculum, client journey map, communications inventory, forms master inventory

#### 2.2 — Upload Brand Assets ✅ DONE (2026-06-01)
- [x] `forhemit_logo_system_v2.svg` (33KB)
- [x] `forhemit_favicon_512.png` (59KB)
- [x] `icon.svg` (427B)

#### 2.3 — Upload Documents ✅ DONE (2026-06-01)
- [x] `forhemit-10-payment-instructions.docx` (18.8KB)
- [x] `forhemit-fee-schedule-exhibit-a-milestone.docx` (28.9KB)
- [x] `forhemit-120-day-roadmap-general.txt` (29.8KB)

#### 2.4 — Verify Cloud Access ✅ DONE (2026-06-01)
- [x] All files accessible via `https://forhemittransition.sharepoint.com/Shared%20Documents/Forhemit%20Deals/_Templates/`
- [x] Document Log list created with correct columns (Title, Deal, Stage, DocumentType, Status, Notes)

---

### Phase 3: Local Drive Documents (Week 2-3)
**Goal:** Move local-only deal documents and files to SharePoint stage folders.

#### 3.1 — Inventory Local Files
- [ ] List all locally generated PDFs (Downloads, app output)
- [ ] List any deal-specific documents on local drive
- [ ] Cross-reference with Convex `generatedDocuments` table
- [ ] Create migration spreadsheet: local file → SharePoint destination

#### 3.2 — Upload to SharePoint Stage Folders
- [ ] Upload local deal documents to corresponding `{Company Name}/` stage folders
- [ ] Preserve folder structure (stage subfolders)
- [ ] Verify file integrity
- [ ] Log migration in "Document Log" SharePoint list

#### 3.3 — Verify Access
- [ ] All uploaded documents accessible from SharePoint
- [ ] Can open, edit, and save from any device
- [ ] Version history working correctly

---

### Phase 4: Forhemit App Integration (Week 3-4)
**Goal:** Add SharePoint as an additional storage option in the Forhemit app. Box.com stays for deal folders and signing.

#### 4.1 — Build SharePoint API Client
- [ ] Create `packages/convex/convex/lib/sharepoint.ts`
  - OAuth 2.0 auth flow (or Membrane-managed auth)
  - `uploadTemplate(fileName, content)` → uploads to SharePoint _Templates
  - `uploadWorkingFile(fileName, content)` → uploads to stage folder
  - `getFileUrl(fileId)` → returns SharePoint document URL
  - `listFolderContents(folderId)` → lists files in folder

#### 4.2 — Update Admin App (Additive)
- [ ] Add "Save to SharePoint" option alongside existing Box workflows
- [ ] Update document preview modal to show SharePoint URL when available
- [ ] Add "Open in SharePoint" button in Company Detail Panel
- [ ] Keep all existing Box.com functionality intact

#### 4.3 — Template Management
- [ ] Store letter templates in SharePoint _Templates (master copies)
- [ ] App reads templates from SharePoint when generating letters
- [ ] Generated PDFs can be saved to either SharePoint or Box depending on use case

---

### Phase 5: Working Model (Ongoing)
**Goal:** Two-system architecture — SharePoint for templates, working files, and local drive consolidation. Box.com for deal document management and signing.

#### 5.1 — How They Work Together
- **SharePoint:** Templates, brand assets, working files, local drive documents, meeting notes, drafts
- **Box.com:** Deal folders, stage subfolders, client documents, NDA signing, LOI signing, all deal-related file management
- **OneDrive:** Personal working files, drafts, letter previews

#### 5.2 — Verify Integration
- [ ] Templates accessible from SharePoint for letter generation
- [ ] Box.com deal workflows unchanged
- [ ] Can work from any device (laptop, phone, tablet)
- [ ] Both systems accessible via browser and mobile apps

#### 5.3 — Future Enhancements
- [ ] Sync signed documents from Box to SharePoint (backup/archive)
- [ ] SharePoint approval workflows for document review
- [ ] Teams integration for collaboration (when team grows)

---

## Security & Compliance

### M365 Business Premium Includes
- **Microsoft Defender for Office 365** — email/link protection
- **Azure AD Premium P1** — Conditional Access, MFA
- **Microsoft Intune** — device management (if needed)
- **Data Loss Prevention (DLP)** — prevent sensitive data leaks
- **Information Barriers** — segment access between deal teams
- **eDiscovery** — legal hold and search capabilities

### Document Security
- [ ] Enable sensitivity labels for deal documents (Confidential, Internal, Public)
- [ ] Configure DLP policy to detect financial data (SSN, EIN, bank accounts)
- [ ] Set external sharing policy (restrict to approved domains only)
- [ ] Enable watermarking for sensitive PDFs (if supported)

### Access Control
- [ ] Conditional Access: require MFA for all SharePoint access
- [ ] Conditional Access: block access from unmanaged devices
- [ ] Guest access: limit to specific folders per deal (Azure B2B)
- [ ] Session timeout: 8 hours for browser, 24 hours for desktop app

---

## Cost Estimate

| Item | Monthly | Annual |
|------|---------|--------|
| M365 Business Premium (per user) | ~$22 | ~$264 |
| SharePoint storage (1TB base + 10GB/user) | Included | Included |
| Box.com (unchanged) | Existing plan | Existing plan |
| **Net new cost (1 user)** | ~$22/mo | ~$264/yr |

*Storage: M365 Business Premium includes 1TB SharePoint + 1TB OneDrive per user. More than sufficient for deal documents.*

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Data loss during migration | Verify uploads, checksums, version history enabled |
| API integration bugs | Build SharePoint client additive — don't touch existing Box code |
| SharePoint performance | Index document library, use metadata views not just folders |
| Compliance gaps | Enable audit logging from day 1, set retention policies before migration |
| Team adoption | Start with one deal, get feedback, then expand |
| API integration bugs | Build SharePoint client alongside Box client, switch gradually |

---

## Decision Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| SharePoint vs OneDrive for deals | **SharePoint** | Team-accessible, structured permissions, audit logging |
| Membrane CLI vs direct Graph API | **Membrane first** | Handles auth automatically, less plumbing. Direct Graph API as fallback |
| Gradual vs big-bang migration | **Gradual** | User preference for slow, careful migration |
| Box.com fate | **Unchanged** | Box.com stays for deal folders and signing. SharePoint handles templates and local files |
| Folder structure | **Mirror existing Box structure** | Familiar to anyone who's used the current system |
| Custom domain | **Not now** | Using `.onmicrosoft.com` domain. Custom domain can be added later |
| Users | **Stefano only (Phase 1)** | Design permissions model for growth, but start with single admin |

---

## Next Immediate Steps

1. **Phase 0 COMPLETED** — Tenant security baseline, Membrane CLI installed, SharePoint + OneDrive connected
2. **Phase 1 COMPLETED** — Templates, brand assets, documents uploaded to SharePoint _Templates/
3. **Phase 2** — Move local drive deal documents to SharePoint stage folders
4. **Phase 3** — Add SharePoint as additional storage option in Forhemit app (Box.com unchanged)
5. **Phase 4** — Ongoing: two-system architecture (SharePoint + Box.com)

---

## Connection IDs (Membrane CLI)

| Service | Connection ID | Status |
|---------|---------------|--------|
| SharePoint | `6a1db3edda10dd2756d54530` | READY |
| OneDrive | `6a1db4fdda10dd2756d568c1` | READY |

## Resource IDs

| Resource | ID | Location |
|----------|-----|----------|
| Root SharePoint site | `forhemittransition.sharepoint.com,2e4aa0c4-42dd-4f84-9b87-d4c94cb3597d,fa7e7423-47e0-4a2b-915d-6713372e0fce` | `https://forhemittransition.sharepoint.com` |
| Documents drive (root) | `b!xKBKLt1ChE-bh9TJTLNZfSN0fvrgRytKkV1nEzcuD85L6jkQu_34SpPOpOLZ28GV` | Root site > Documents |
| Forhemit Deals folder | `01JUHA5B234GN2PKFTFZE2UPWG32HZEN5A` | Documents > Forhemit Deals |
| Document Log list | `a99d5512-a90a-4c0e-a93f-48932019abd4` | `https://forhemittransition.sharepoint.com/Lists/Document%20Log` |
| OneDrive drive | `b!qk0MguXX1kidxTXdafRBcYDUxWPohPFNs0QYV9TYVqEFFKkEyd4oT6woMDhyByrX` | Personal OneDrive |
| OneDrive working folder | `01Y2WXMT53QD7LSMTUEJDLDT2JFC52V7DG` | OneDrive > Forhemit Working Files |
| HTML-Previews folder | `01JUHA5B2MMZKZXVZON5BY4NXTJKYQJ6NA` | _Templates > HTML-Previews |
| React-Components folder | `01JUHA5B64YTK4SY3K7FAIAXZJM2AUMETB` | _Templates > React-Components |
| Brand-Assets folder | `01JUHA5B2LT7GODTVDOJGLK3LLSBJTLXIN` | _Templates > Brand-Assets |
| Documents folder | `01JUHA5B56UZTEQBN5SJFIISYWQBR47KCS` | _Templates > Documents |

## Folder Structure (Created 2026-06-01)

```
forhemittransition.sharepoint.com/Shared Documents/
└── 📁 Forhemit Deals/
    ├── 📁 01-First-Touch/
    ├── 📁 02-Qualification/
    ├── 📁 03-Engagement/
    ├── 📁 04-Diligence/
    ├── 📁 05-Closing/
    ├── 📁 06-Post-Close/
    └── 📁 _Templates/

OneDrive (stefanostokes@forhemittransition.onmicrosoft.com)/
└── 📁 Forhemit Working Files/
    ├── 📁 Drafts/
    ├── 📁 Letter Previews/
    └── 📁 Meeting Notes/
```

---

*Plan created: 2026-06-01*
*Phase 0 COMPLETED: Foundation set up, connections ready, folder structure created*
*Phase 1 COMPLETED: Templates, brand assets, documents uploaded to SharePoint*
*Status: Ready for Phase 2 — Local Drive Documents*
