/**
 * src/config/companies.ts
 *
 * Single source of truth for all company configuration.
 * To add a seventh company: append one object to the `companies` array.
 * No other file needs to change.
 *
 * Design tokens (accent, brandMark, tint) must also be added to
 * src/styles/tokens.css under a [data-company="<id>"] selector.
 *
 * accent    — used on surfaces that carry white text (buttons, active tabs)
 * brandMark — used for logos, dot indicators, and decorative elements only
 * tint      — light background wash (cards, badges)
 * onAccent  — always #FFFFFF per spec; text on any accent-filled surface
 */

export interface CompanyConfig {
  id: string;
  name: string;
  /** Two-letter abbreviation shown in tabs and avatar fallback */
  abbr: string;
  accent: string;
  brandMark: string;
  tint: string;
  onAccent: '#FFFFFF';
  /** IDs of apps this company's staff can see in the launcher */
  enabledAppIds: string[];
}

export const companies: CompanyConfig[] = [
  {
    id: 'travels',
    name: 'Finchglow Travels',
    abbr: 'FG',
    accent: '#C1121F',
    brandMark: '#ef233c',
    tint: '#FDE8EA',
    onAccent: '#FFFFFF',
    enabledAppIds: [
      'booking-tool',
      'corporate-crm',
      'supplier-portal',
      'report-centre',
      'learning-platform',
      'hr-self-service',
      'facilities-requests',
    ],
  },
  {
    id: 'fcm',
    name: 'FCM Travel Nigeria',
    abbr: 'FC',
    accent: '#7f055f',
    brandMark: '#7f055f',
    tint: '#e5a4cb',
    onAccent: '#FFFFFF',
    enabledAppIds: [
      'booking-tool',
      'corporate-crm',
      'supplier-portal',
      'gds-terminal',
      'report-centre',
      'learning-platform',
      'hr-self-service',
      'facilities-requests',
    ],
  },
  {
    id: 'travelden',
    name: 'Travelden',
    abbr: 'TD',
    accent: '#ac274f',
    brandMark: '#eb638b',
    tint: '#FCE9EF',
    onAccent: '#FFFFFF',
    enabledAppIds: [
      'booking-tool',
      'supplier-portal',
      'gds-terminal',
      'report-centre',
      'learning-platform',
      'hr-self-service',
      'facilities-requests',
    ],
  },
  {
    id: 'holidays',
    name: 'Finchglow Holidays',
    abbr: 'FH',
    accent: '#7d4f50',
    brandMark: '#cc8b86',
    tint: '#f9eae1',
    onAccent: '#FFFFFF',
    enabledAppIds: [
      'holidays-booking',
      'supplier-portal',
      'report-centre',
      'learning-platform',
      'hr-self-service',
      'facilities-requests',
    ],
  },
  {
    id: 'academy',
    name: 'Lagos Aviation Academy',
    abbr: 'LA',
    accent: '#4e598c',
    brandMark: '#4e598c',
    tint: '#E9EBF4',
    onAccent: '#FFFFFF',
    enabledAppIds: [
      'learning-platform',
      'flight-simulator',
      'crm-academy',
      'hr-self-service',
      'facilities-requests',
    ],
  },
  {
    id: 'global',
    name: 'FinchGlobal',
    abbr: 'GL',
    accent: '#7b515b',
    brandMark: '#7b515b',
    tint: '#F3ECEE',
    onAccent: '#FFFFFF',
    enabledAppIds: [
      'facilities-mgmt',
      'facilities-requests',
      'hr-self-service',
      'learning-platform',
      'report-centre',
    ],
  },
]
