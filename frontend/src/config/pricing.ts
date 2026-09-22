export interface PlanConfig {
  id: 'monthly' | 'yearly';
  name: string;
  price: number;
  currency: string;
  badge?: string;
  savingsText?: string;
  billingFrequency: string;
  priceNote: string;
  description: string;
  features: string[];
  ctaText: string;
  popular?: boolean;
}

/**
 * Subscription plan configurations.
 * Monthly: $19.00 USD / month
 * Yearly: $190.00 USD / year (Save $38/year compared to 12 monthly charges)
 */
export const SUBSCRIPTION_PLANS: PlanConfig[] = [
  {
    id: 'monthly',
    name: 'Monthly Membership',
    price: 19,
    currency: 'USD',
    billingFrequency: 'Billed monthly',
    priceNote: 'Flexible monthly billing',
    description: 'Full access to golf scoring, charity fundraising, and monthly prize draws with zero lock-in.',
    features: [
      'Log and maintain your latest 5 Stableford scores',
      'Select and direct your contribution to any verified charity (min. 10%)',
      'Automatic entry into the monthly prize pool draw',
      'Eligibility for 3, 4, and 5-number match prize tiers',
      'Jackpot rollover qualification for 5-number match',
      'Cancel anytime with access until period end'
    ],
    ctaText: 'Subscribe Monthly'
  },
  {
    id: 'yearly',
    name: 'Annual Supporter',
    price: 190,
    currency: 'USD',
    badge: 'Best Value — 2 Months Free',
    savingsText: 'Save $38/year (~17% off)',
    billingFrequency: 'Billed annually',
    priceNote: 'Discounted annual rate ($190/yr)',
    description: 'Commit to your game and community impact for the full season at a discounted annual rate.',
    features: [
      'All features included in the Monthly Membership',
      'Preferred annual discounted rate ($190 vs $228 monthly)',
      'Guaranteed continuous eligibility across 12 monthly draws',
      'Year-round sustained charitable contributions to your cause',
      'Priority verification for winner prize claims',
      'Annual impact report showing total charity contributions'
    ],
    ctaText: 'Subscribe Annually',
    popular: true
  }
];
