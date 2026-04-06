// ESOP Partner CRM Module

export { ESOPPartnerCRM } from './components/ESOPPartnerCRM';
export { usePartnerCRM } from './hooks/usePartnerCRM';

// Types
export type {
  PartnerContact,
  PartnerType,
  EngagementStage,
  ActivityType,
  JourneyStep,
  JourneyStepState,
  Note,
  Activity,
  ViewMode,
  CardViewMode,
  SortConfig,
} from './types';

// Constants
export {
  ALL_STATES,
  TYPE_COLORS,
  STAGE_META,
  NUDGE_DAYS,
  STAGE_ORDER,
  JOURNEY_STEPS,
  DEFAULT_CONTACTS,
} from './constants';
