-- ====================================================================
-- Digital Heroes Platform: Seed Data (Non-Auth)
-- Migration: 003_seed.sql
-- Description: Seeds realistic charity organizations and associated charity events.
--              NOTE: Does NOT insert into auth.users or create fake passwords.
-- ====================================================================

-- 1. SEED CHARITIES
INSERT INTO public.charities (id, name, description, category, image_url, website_url, featured, active)
VALUES 
  (
    'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81',
    'Youth on Course Foundation',
    'Providing youth with subsidized access to golf courses and life-changing opportunities through golf rounds, caddie academies, and paid high school internships.',
    'Youth & Community Development',
    'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=800&q=80',
    'https://youthoncourse.org',
    true,
    true
  ),
  (
    'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c82',
    'Green Fairways Conservation Alliance',
    'Dedicated to environmental sustainability and water conservation across public and private golf facilities, preserving native biodiversity and pollinator corridors.',
    'Environmental Sustainability',
    'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=800&q=80',
    'https://example.org/green-fairways',
    true,
    true
  ),
  (
    'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c83',
    'Veterans Golf Association (VGA)',
    'Enriching the lives of our nation’s veterans and their family members through the camaraderie and sportsmanship of competitive golf and adaptive sports therapy.',
    'Veteran Support & Rehabilitation',
    'https://images.unsplash.com/photo-1592919505780-303950717480?auto=format&fit=crop&w=800&q=80',
    'https://vgagolf.org',
    false,
    true
  ),
  (
    'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c84',
    'First Tee STEM & Scholar Initiative',
    'Empowering kids and teens through golf-based curriculum integrating Science, Technology, Engineering, and Math (STEM) with core leadership values.',
    'Education & Sports Access',
    'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?auto=format&fit=crop&w=800&q=80',
    'https://firsttee.org',
    false,
    true
  )
ON CONFLICT (name) DO UPDATE 
SET 
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  image_url = EXCLUDED.image_url,
  website_url = EXCLUDED.website_url,
  featured = EXCLUDED.featured,
  active = EXCLUDED.active,
  updated_at = now();

-- 2. SEED CHARITY EVENTS
INSERT INTO public.charity_events (charity_id, title, description, event_date)
VALUES
  (
    'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81',
    'Youth Champions Invitational Pro-Am',
    'Annual 18-hole scramble tournament pairing junior golfers with tour pros to raise academic scholarship funds.',
    now() + INTERVAL '30 days'
  ),
  (
    'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c82',
    'Eco-Links Summit & Tree Planting Day',
    'Hands-on conservation day bringing community volunteers together to plant native flora on course perimeters.',
    now() + INTERVAL '45 days'
  ),
  (
    'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c83',
    'Heroes Cup Veteran Memorial Scramble',
    'Celebratory tournament honoring active-duty and retired military service members with adaptive golf clinics.',
    now() + INTERVAL '60 days'
  );
