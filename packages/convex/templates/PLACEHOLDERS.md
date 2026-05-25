# Template Placeholder Reference

**Generated:** 2026-05-24
**Total unique placeholders:** ~120

## Placeholder Syntax

All templates use Mustache-style `{{variableName}}` placeholders. Conditional blocks use `{{#if condition}}...{{/if}}` and `{{#each array}}...{{/each}}`.

## Common Placeholders (Used in 10+ Templates)

| Placeholder | Count | Source | Description |
|-------------|-------|--------|-------------|
| `{{ref}}` | 140 | computed | Engagement reference number (e.g., "FHH-0023") |
| `{{companyName}}` | 61 | crmCompanies | Company legal name |
| `{{generatedDate}}` | 52 | computed | Date document was generated |
| `{{closingDate}}` | 29 | crmDeals | Actual or target closing date |
| `{{recipientName}}` | 16 | computed | Full name of document recipient |

## Deal Data (from crmDeals)

| Placeholder | Description | Used In |
|-------------|-------------|---------|
| `{{ref}}` | Engagement reference | All templates |
| `{{feeTier}}` | Fee tier (1, 2, or 3) | Engagement, closing |
| `{{ebitda}}` | QofE-normalized TTM EBITDA | Engagement, diligence |
| `{{purchasePrice}}` | ESOP purchase price | LOI, closing |
| `{{closingDate}}` | Actual or target closing date | Closing, post-close |
| `{{daysElapsed}}` | Days since engagement started | Status updates |
| `{{currentGate}}` | Current gate number (1-4) | Status updates |
| `{{exclusivityPeriod}}` | LOI exclusivity period | LOI |

## Company Data (from crmCompanies)

| Placeholder | Description | Used In |
|-------------|-------------|---------|
| `{{companyName}}` | Company legal name | All templates |
| `{{industry}}` | Industry classification | Screener, intake |
| `{{city}}` | Company city | Screener |
| `{{state}}` | Company state | Screener |
| `{{employeeCount}}` | Number of employees | Screener |
| `{{revenue}}` | Annual revenue | Screener |

## Contact Data (from crmContacts)

| Placeholder | Description | Used In |
|-------------|-------------|---------|
| `{{sellerName}}` | Seller full name | Seller-facing docs |
| `{{sellerTitle}}` | Seller title/role | Seller-facing docs |
| `{{brokerName}}` | Broker full name | Broker-facing docs |
| `{{brokerFirm}}` | Brokerage firm name | Broker-facing docs |
| `{{lenderName}}` | Lender contact name | Lender-facing docs |
| `{{lenderContact}}` | Lender contact name | Lender updates |
| `{{trusteeName}}` | Trustee full name | Trustee-facing docs |
| `{{trusteeFirm}}` | Trustee firm name | Trustee-facing docs |
| `{{counselName}}` | ERISA counsel name | Counsel-facing docs |
| `{{cpaName}}` | CPA name | CPA-facing docs |
| `{{recipientName}}` | Generic recipient name | Various |
| `{{recipientEmail}}` | Generic recipient email | Internal |

## Retainer & Fee Data

| Placeholder | Description | Used In |
|-------------|-------------|---------|
| `{{retainerAmount}}` | Retainer dollar amount | Engagement letter |
| `{{retainerType}}` | "Refundable" or "Non-Refundable" | Engagement letter |
| `{{retainerDue}}` | Retainer payment due date | Fee tracker |
| `{{totalFee}}` | Total engagement fee | Fee tracker |
| `{{stewardshipFee}}` | Annual stewardship fee | Post-close |
| `{{annualFee}}` | Annual COOP fee | COOP kickoff |

## Gate Data

| Placeholder | Description | Used In |
|-------------|-------------|---------|
| `{{gate1Status}}` | Gate 1 status (Cleared/Pending/Blocked) | Dashboard, status |
| `{{gate2Status}}` | Gate 2 status | Dashboard, status |
| `{{gate3Status}}` | Gate 3 status | Dashboard, status |
| `{{gate4Status}}` | Gate 4 status | Dashboard, status |
| `{{gate1Target}}` | Gate 1 target date | Dashboard |
| `{{gate2Target}}` | Gate 2 target date | Dashboard |
| `{{gate3Target}}` | Gate 3 target date | Dashboard |
| `{{gate4Target}}` | Gate 4 target date | Dashboard |
| `{{gateDate}}` | Date gate was cleared | Gate confirmations |
| `{{gateNumber}}` | Gate number (1-4) | Gate failure |

## COOP / Stewardship Data

| Placeholder | Description | Used In |
|-------------|-------------|---------|
| `{{monthNumber}}` | Current stewardship month | Monthly checkin |
| `{{totalMonths}}` | Total stewardship months | Monthly checkin |
| `{{quarterNumber}}` | Current quarter | Quarterly report |
| `{{track1Progress}}` | Track 1 (People) progress | Status reports |
| `{{track2Progress}}` | Track 2 (Systems) progress | Status reports |
| `{{track3Progress}}` | Track 3 (Financial) progress | Status reports |
| `{{track4Progress}}` | Track 4 (Governance) progress | Status reports |
| `{{coopVersion}}` | Current COOP version | COOP tracker |

## Computed Values

| Placeholder | Description | Used In |
|-------------|-------------|---------|
| `{{generatedDate}}` | Current date, formatted | All templates |
| `{{recipientName}}` | Resolved recipient name | Various |
| `{{weekDate}}` | Week of date | Weekly updates |
| `{{meetingDate}}` | Meeting date | Meeting templates |
| `{{meetingTime}}` | Meeting time | Meeting templates |
| `{{invoiceNumber}}` | Invoice number | Invoices |

## Conditional Placeholders

Some templates use `{{#if}}` blocks for optional content:

```
{{#if condition2}}
<div class="si"><span class="si-n">2.</span><span><strong>{{condition2}}</strong> — {{condition2Details}}</span></div>
{{/if}}
```

These are handled by the Mustache template engine and do not need special treatment in the placeholder replacement logic.
