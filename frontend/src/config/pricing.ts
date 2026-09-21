export interface PlanConfig {
  id: 'monthly' | 'yearly';
  name: string;
  badge?: string;
  billingFrequency: string;
  priceNote: string;
  description: string;
  features: string[];
  ctaText: string;
  popular?: boolean;
}

/**
 * Subscription plan configurations.
 * Note: Exact monetary values are configured in the Stripe/Payment phase.
 * Features and tier differences follow the Digital Heroes PRD specifications.
 */
export const SUBSCRIPTION_PLANS: PlanConfig[] = [
  {
    id: 'monthly',
    name: 'Monthly Membership',
    billingFrequency: 'Billed monthly',
    priceNote: 'Flexible monthly billing',
    description: 'Full access to golf scoring, charity fundraising, and monthly prize draws with zero lock-in.',
    features: [
      'Log and maintain your latest 5 Stableford scores',
      'Select and direct your contribution to any verified charity (min. 10%)',
      'Automatic entry into the monthly prize pool draw',
      'Eligibility for 3, 4, and 5-number match prize tiers',
      'Jackpot rollover qualification for 5-number match',
      'Cancel anytime with seamless renewal tracking'
    ],
    ctaText: 'Start Monthly Membership'
  },
  {
    id: 'yearly',
    name: 'Annual Supporter',
    badge: 'Discounted Annual Rate',
    billingFrequency: 'Billed annually',
    priceNote: 'Discounted annual rate (~2 months free)',
    description: 'Commit to your game and community impact for the full season at a discounted annual rate.',
    features: [
      'All features included in the Monthly Membership',
      'Preferred annual discounted rate compared to monthly renewal',
      'Guaranteed continuous eligibility across 12 monthly draws',
      'Year-round sustained charitable contributions to your cause',
      'Priority verification for winner prize claims',
      'Annual impact report showing total charity contributions'
    ],
    ctaText: 'Join as Annual Supporter',
    popular: true
  }
];
