export interface Charity {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  image_url: string | null;
  website_url: string | null;
  featured: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CharityEvent {
  id: string;
  charity_id: string;
  title: string;
  description: string | null;
  event_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CharityDetail extends Charity {
  events: CharityEvent[];
}
