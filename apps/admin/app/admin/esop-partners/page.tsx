import { Metadata } from 'next';
import { ESOPPartnerCRM } from './components/ESOPPartnerCRM';

export const metadata: Metadata = {
  title: 'ESOP Partner CRM',
  description: 'Manage ESOP partner relationships, track onboarding journeys, and monitor engagement',
};

export default function ESOPPartnersPage() {
  return <ESOPPartnerCRM />;
}
