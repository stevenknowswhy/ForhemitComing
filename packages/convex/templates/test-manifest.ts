/**
 * Test script for template manifest
 * Run: npx ts-node packages/convex/templates/test-manifest.ts
 */

import {
  templates,
  getTemplatesByStage,
  getTemplatesByPipeline,
  getTemplatesByAudience,
  getTemplatesByStatus,
  getUrgentTemplates,
  getExistingTemplates,
  getGapTemplates,
  getSignatureTemplates,
  getRecurringTemplates,
  getTemplateById,
  getAllStages,
  getTemplateStats,
} from './manifest';

console.log('=== Forhemit Template Manifest Test ===\n');

// Test 1: Get statistics
const stats = getTemplateStats();
console.log('1. Template Statistics:');
console.log(`   Total: ${stats.total}`);
console.log(`   External: ${stats.external}`);
console.log(`   Internal: ${stats.internal}`);
console.log(`   Exists: ${stats.exists}`);
console.log(`   Partial: ${stats.partial}`);
console.log(`   Gap: ${stats.gap}`);
console.log(`   Urgent: ${stats.urgent}`);
console.log(`   Requires Signature: ${stats.requiresSignature}`);
console.log(`   Is Required: ${stats.isRequired}`);
console.log(`   Is Recurring: ${stats.isRecurring}`);
console.log('');

// Test 2: Get all stages
const stages = getAllStages();
console.log('2. All Stages:');
stages.forEach(stage => {
  const count = getTemplatesByStage(stage).length;
  console.log(`   ${stage}: ${count} documents`);
});
console.log('');

// Test 3: Get urgent templates (Deal 1 blockers)
const urgent = getUrgentTemplates();
console.log(`3. Urgent Templates (${urgent.length}):`);
urgent.forEach(t => {
  console.log(`   - ${t.name} (${t.id})`);
});
console.log('');

// Test 4: Get existing templates
const existing = getExistingTemplates();
console.log(`4. Existing Templates (${existing.length}):`);
existing.slice(0, 5).forEach(t => {
  console.log(`   - ${t.name}`);
});
if (existing.length > 5) {
  console.log(`   ... and ${existing.length - 5} more`);
}
console.log('');

// Test 5: Get templates by audience
const sellerDocs = getTemplatesByAudience('seller');
console.log(`5. Seller-facing Documents: ${sellerDocs.length}`);

const brokerDocs = getTemplatesByAudience('broker');
console.log(`   Broker-facing Documents: ${brokerDocs.length}`);

const lenderDocs = getTemplatesByAudience('lender');
console.log(`   Lender-facing Documents: ${lenderDocs.length}`);
console.log('');

// Test 6: Get signature templates
const signatureDocs = getSignatureTemplates();
console.log(`6. Signature Templates (${signatureDocs.length}):`);
signatureDocs.forEach(t => {
  console.log(`   - ${t.name}`);
});
console.log('');

// Test 7: Get recurring templates
const recurringDocs = getRecurringTemplates();
console.log(`7. Recurring Templates (${recurringDocs.length}):`);
recurringDocs.forEach(t => {
  console.log(`   - ${t.name} (${t.recurrenceRule})`);
});
console.log('');

// Test 8: Get template by ID
const engagementLetter = getTemplateById('external/03-engagement/engagement-letter');
if (engagementLetter) {
  console.log('8. Get Template by ID:');
  console.log(`   Name: ${engagementLetter.name}`);
  console.log(`   Status: ${engagementLetter.status}`);
  console.log(`   Pipeline: ${engagementLetter.pipeline}`);
  console.log(`   Stage: ${engagementLetter.stage}`);
  console.log(`   Requires Signature: ${engagementLetter.requiresSignature}`);
}
console.log('');

// Test 9: Get templates by pipeline
const externalDocs = getTemplatesByPipeline('external');
const internalDocs = getTemplatesByPipeline('internal');
console.log('9. Pipeline Distribution:');
console.log(`   External: ${externalDocs.length}`);
console.log(`   Internal: ${internalDocs.length}`);
console.log('');

// Test 10: Get gap templates
const gapDocs = getGapTemplates();
console.log(`10. Gap Templates (${gapDocs.length}):`);
gapDocs.slice(0, 5).forEach(t => {
  console.log(`    - ${t.name} (${t.status})`);
});
if (gapDocs.length > 5) {
  console.log(`    ... and ${gapDocs.length - 5} more`);
}
console.log('');

console.log('=== Test Complete ===');
