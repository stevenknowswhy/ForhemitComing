# Console Cleanup Plan

## Summary
- **Total console statements found**: 379
- **Production source**: 91 (admin/app: 48, marketing/app: 12, convex/convex: 31)
- **Scripts**: 288 (admin/scripts: 163, marketing/scripts: 86, convex/scripts: 39)

## Strategy
- **Production source**: Remove `console.log`/`console.debug` debug/progress logging. Keep `console.error`/`console.warn` for real error handling.
- **Convex mutations/actions**: Keep `console.log` in mutation/action handlers that log to the Convex dashboard (Convex logs these to the dashboard). Remove only clearly debug-only statements.
- **Scripts**: Keep essential operational output (test results, summaries, seed counts). Remove excessive verbose debug logging.

---

## PRODUCTION SOURCE — `apps/admin/app/`

### `api/pdf-generate/route.ts` — REMOVE 7 console.log
| Line | Statement | Action |
|------|-----------|--------|
| 24 | `console.log('PDF generation started for:', templateName)` | REMOVE |
| 33 | `console.log('Launching browser...', ...)` | REMOVE |
| 60 | `console.log('Found Chrome at:', path)` | REMOVE |
| 79 | `console.log('Browser launched successfully')` | REMOVE |
| 289 | `console.log('Setting page content...')` | REMOVE |
| 293 | `console.log('Page content set')` | REMOVE |
| 301 | `console.log('Generating PDF...')` | REMOVE |
| 319 | `console.log('PDF generated successfully')` | REMOVE |
| 81 | `console.error('Browser launch error:', browserError)` | KEEP |
| 333 | `console.error('Page/PDF error:', pageError)` | KEEP |
| 345 | `console.error('PDF generation error:', error)` | KEEP |

### `api/webhooks/clerk/route.ts` — REMOVE 5 console.log
| Line | Statement | Action |
|------|-----------|--------|
| 60 | `console.log('No primary email found for user:', id)` | REMOVE |
| 66 | `console.log('User with non-allowed email attempted sign-up:', primaryEmail)` | REMOVE |
| 71 | `console.log('Deleted user with unauthorized email:', primaryEmail)` | REMOVE |
| 90 | `console.log('Assigned super-admin role to:', primaryEmail)` | REMOVE |
| 103 | `console.log('Assigned admin role to:', primaryEmail)` | REMOVE |
| 12 | `console.error('CLERK_WEBHOOK_SECRET is not set')` | KEEP |
| 44 | `console.error('Error verifying webhook:', err)` | KEEP |
| 73 | `console.error('Failed to delete unauthorized user:', error)` | KEEP |
| 92 | `console.error('Failed to assign super-admin role:', error)` | KEEP |
| 105 | `console.error('Failed to assign admin role:', error)` | KEEP |

### Other admin/app files — ALL KEEP (all are console.error/warn in catch blocks)
- `forms/[taskId]/page.tsx` — console.error in catch ✅
- `admin/esop-partners/hooks/usePartnerCRM.ts` — console.error in catch ✅
- `admin/letters/components/BrokerIntroductionEmail.tsx` — console.error ✅
- `admin/letters/components/BrokerTearSheet.tsx` — console.error ✅
- `admin/crm/components/DealSummary.tsx` — console.error ✅
- `admin/crm/components/views/DealQueueView.tsx` — console.error ✅
- `admin/crm/hooks/useCrmCompanies.ts` — console.warn (fire-and-forget error) ✅
- `admin/templates/DocumentPreviewModal.tsx` — console.error/warn ✅
- `components/ErrorBoundary.tsx` — console.error ✅
- `error.tsx` — console.error ✅
- All `api/` routes (non-pdf, non-clerk) — console.error ✅

**Admin/app total: REMOVE 12, KEEP 36**

---

## PRODUCTION SOURCE — `apps/marketing/app/`

### `api/pdf-generate/route.ts` — check for console.log
| Statement | Action |
|-----------|--------|
| Line 216: `console.error('PDF generation error:', error)` | KEEP |

### All other marketing/app files — ALL KEEP
- `home/intake/lib/mockApi.ts` — console.error ✅
- `admin/esop-partners/hooks/usePartnerCRM.ts` — console.error ✅
- `business-owners/components/ConfidentialIntakeModal.tsx` — console.error ✅
- `components/contact/ContactFormExperience.tsx` — console.error ✅
- `components/forms/EarlyAccessForm.tsx` — console.error ✅
- `components/forms/application/ApplicationModal.tsx` — console.error ✅
- `components/modals/InfrastructureAuditModal.tsx` — console.error ✅
- `components/ErrorBoundary.tsx` — console.error ✅
- `error.tsx` — console.error ✅

**Marketing/app total: REMOVE 0, KEEP 12** (all are error handling)

---

## PRODUCTION SOURCE — `packages/convex/convex/`

### REMOVE (debug/progress logging in Convex actions — not useful in dashboard)
| File | Line | Statement | Action |
|------|------|-----------|--------|
| `templateEmailer.ts` | 84 | `console.log('Sending email to ${to}...')` | REMOVE |
| `templateEmailer.ts` | 105 | `console.log('Email sent successfully to ${to}')` | REMOVE |
| `documentTemplates.ts` | 251 | `console.log("Existing templates:", existingSlugs)` | REMOVE |
| `templateGenerator.ts` | 71 | `console.log('Template loaded: ...')` | REMOVE |
| `templateGenerator.ts` | 86 | `console.log('PDF generated: ...KB')` | REMOVE |
| `templateGenerator.ts` | 127 | `console.log('Email sent successfully to ...')` | REMOVE |
| `emailCore.ts` | 70 | `console.log("Email sent successfully:", data.id)` | REMOVE |
| `pdfGenerator.ts` | 25 | `console.log('Generating PDF for template: ...')` | REMOVE |
| `pdfGenerator.ts` | 47 | `console.log('PDF generated: ...KB')` | REMOVE |

### KEEP (error handling / warnings)
| File | Statement | Reason |
|------|-----------|--------|
| `templateEmailer.ts:101` | `console.error("Email send failed:", ...)` | Error handling |
| `templateEmailer.ts:108` | `console.error("Email send error:", error)` | Error handling |
| `pdfGenerator.ts:39` | `console.error("PDF generation failed")` | Error handling |
| `pdfGenerator.ts:51` | `console.error("PDF generation fetch error")` | Error handling |
| `emailCore.ts:32` | `console.error("RESEND_API_KEY not configured")` | Config error |
| `emailCore.ts:66` | `console.error("Resend API error:", data)` | Error handling |
| `emailCore.ts:73` | `console.error("Error sending email:", error)` | Error handling |
| `emailCore.ts:88` | `console.error("TELEGRAM_BOT_TOKEN...")` | Config error |
| `emailCore.ts:112` | `console.error("Telegram API error:", data)` | Error handling |
| `emailCore.ts:118` | `console.error("Error sending Telegram message")` | Error handling |
| `emailCore.ts:157` | `console.error("Failed to log outbound email")` | Error handling |
| `templateGenerator.ts:64` | `console.error("Template not found...")` | Error handling |
| `templateGenerator.ts:118` | `console.error("Email send failed:")` | Error handling |
| `templateGenerator.ts:135` | `console.error("Document generation failed")` | Error handling |
| `opensign.ts:127` | `console.warn("No workflow task found...")` | Warning |
| `notifications.ts:45` | `console.warn("Telegram not configured")` | Warning |
| `notifications.ts:75` | `console.error("Telegram API error")` | Error handling |
| `notifications.ts:237` | `console.warn("Slack not configured")` | Warning |
| `notifications.ts:259` | `console.error("Slack API error")` | Error handling |
| `templateRules.ts:67` | `console.warn("Unknown stage prefix...")` | Warning |
| `seedStageRequirements.ts:38` | `console.warn("Template not found")` | Warning |
| `agentQueue.ts:356` | `console.warn("Failed to queue agent work")` | Warning |

**Convex total: REMOVE 9, KEEP 22**

---

## SCRIPTS — `apps/admin/scripts/`, `apps/marketing/scripts/`, `packages/convex/scripts/`

Scripts are standalone CLI tools. Their console output IS their interface. All console.log for test results, summaries, progress, and configuration checks are **essential operational output** and should be KEPT.

Console.error in catch blocks is also essential for debugging script failures.

**Scripts total: REMOVE 0, KEEP 288**

---

## GRAND TOTAL
- **REMOVE**: 21 console statements (12 in admin/app, 0 in marketing/app, 9 in convex/convex)
- **KEEP**: 358 console statements (error/warn handling + script operational output)

## Files to Edit (8 files)
1. `apps/admin/app/api/pdf-generate/route.ts` — remove 8 console.log
2. `apps/admin/app/api/webhooks/clerk/route.ts` — remove 5 console.log
3. `packages/convex/convex/templateEmailer.ts` — remove 2 console.log
4. `packages/convex/convex/documentTemplates.ts` — remove 1 console.log
5. `packages/convex/convex/templateGenerator.ts` — remove 3 console.log
6. `packages/convex/convex/emailCore.ts` — remove 1 console.log
7. `packages/convex/convex/pdfGenerator.ts` — remove 2 console.log

## Verification
- Run `npx tsc --noEmit` in `packages/convex`, `apps/admin`, `apps/marketing`
