import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar.tsx';
import Footer from '../../components/layout/Footer.tsx';
import Hero from '../../components/home/Hero.tsx';
import HowItWorksSection from '../../components/home/HowItWorksSection.tsx';
import CharityImpactSection from '../../components/home/CharityImpactSection.tsx';
import DrawExplainer from '../../components/home/DrawExplainer.tsx';
import PricingPreview from '../../components/home/PricingPreview.tsx';
import CallToAction from '../../components/home/CallToAction.tsx';
import { getCharities } from '../../services/api.ts';
import { Charity } from '../../types/charity.js';

export const LandingPage: React.FC = () => {
  const [featuredCharity, setFeaturedCharity] = useState<Charity | null>(null);

  useEffect(() => {
    document.title = 'Digital Heroes | Golf Performance, Charity Impact & Monthly Draws';

    let isMounted = true;
    const loadFeaturedCharity = async () => {
      try {
        const charities = await getCharities();
        if (isMounted && charities.length > 0) {
          // Select charity with featured === true, or fallback to the first active charity
          const featured = charities.find((c) => c.featured && c.active) || charities[0];
          setFeaturedCharity(featured);
        }
      } catch (err) {
        // Non-blocking error for homepage; fallback cleanly without crashing
        console.error('Could not load featured charity for homepage', err);
      }
    };

    loadFeaturedCharity();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500/20 selection:text-brand-300">
      <Navbar />

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <Hero />

        {/* 4-Step How It Works Preview */}
        <HowItWorksSection />

        {/* Charity Impact Section with Live Supabase Partner */}
        <CharityImpactSection featuredCharity={featuredCharity} />

        {/* Draw Explainer & Prize Distribution */}
        <DrawExplainer />

        {/* Membership Plans & Pricing Preview */}
        <PricingPreview />

        {/* Call to Action */}
        <CallToAction />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
