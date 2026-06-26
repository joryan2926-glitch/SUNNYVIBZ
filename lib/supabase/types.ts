export type Event = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  description: string | null;
  start_date: string;
  end_date: string | null;
  location: string | null;
  image_url: string | null;
  category: string | null;
  price_label: string | null;
  published: boolean;
  created_at: string;
};

export type Artist = {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  specialty: string | null;
  image_url: string | null;
  instagram_url: string | null;
  website_url: string | null;
  status: "active" | "inactive";
  featured: boolean;
  published: boolean;
  created_at: string;
};

export type Workshop = {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url: string | null;
  start_date: string;
  location: string;
  price_label: string;
  base_price_cents: number | null;
  subscriber_price_cents: number | null;
  creative_price_cents: number | null;
  premium_price_cents: number | null;
  capacity: number;
  seats_remaining: number;
  status: "available" | "full" | "cancelled";
  requires_booking: boolean;
  subscriber_priority: boolean;
  access_notes: string | null;
  published: boolean;
  created_at: string;
};

export type WorkshopBooking = {
  id: string;
  workshop_id: string;
  workshop_title: string;
  workshop_date: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  subscription_plan_slug: string | null;
  pricing_note: string | null;
  priority_access: boolean;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  category: string | null;
  author: string;
  published_at: string | null;
  content: string;
  status: "published" | "draft";
  created_at: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  roles: string[];
  artist_status: "active" | "inactive";
  is_admin: boolean;
  created_at: string;
};

export type SubscriptionPlan = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_label: string;
  amount_cents: number;
  billing_period: "month" | "year";
  commitment_label: string;
  access_label: string;
  objective_label: string;
  benefits: string[];
  workshop_discount_percent: number;
  priority_level: number;
  featured: boolean;
  active: boolean;
  sort_order: number;
  created_at: string;
};

export type Subscription = SubscriptionPlan;

export type UserSubscription = {
  id: string;
  user_id: string;
  plan_id: string | null;
  status: "active" | "past_due" | "cancelled" | "expired";
  started_at: string;
  ends_at: string | null;
  created_at: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  image_url: string;
  alt: string | null;
  category: string | null;
  artist_name: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: "new" | "read" | "archived";
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      events: {
        Row: Event;
        Insert: Omit<Event, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Event, "id" | "created_at">>;
        Relationships: [];
      };
      artists: {
        Row: Artist;
        Insert: Omit<Artist, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Artist, "id" | "created_at">>;
        Relationships: [];
      };
      workshops: {
        Row: Workshop;
        Insert: Omit<Workshop, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Workshop, "id" | "created_at">>;
        Relationships: [];
      };
      workshop_bookings: {
        Row: WorkshopBooking;
        Insert: Omit<WorkshopBooking, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<WorkshopBooking, "id" | "created_at">>;
        Relationships: [];
      };
      articles: {
        Row: Article;
        Insert: Omit<Article, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Article, "id" | "created_at">>;
        Relationships: [];
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at"> & {
          created_at?: string;
        };
        Update: Partial<Omit<Profile, "id" | "created_at">>;
        Relationships: [];
      };
      subscription_plans: {
        Row: SubscriptionPlan;
        Insert: Omit<SubscriptionPlan, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<SubscriptionPlan, "id" | "created_at">>;
        Relationships: [];
      };
      user_subscriptions: {
        Row: UserSubscription;
        Insert: Omit<UserSubscription, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<UserSubscription, "id" | "created_at">>;
        Relationships: [];
      };
      gallery: {
        Row: GalleryItem;
        Insert: Omit<GalleryItem, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<GalleryItem, "id" | "created_at">>;
        Relationships: [];
      };
      contact_messages: {
        Row: ContactMessage;
        Insert: Omit<ContactMessage, "id" | "created_at" | "status"> & {
          id?: string;
          status?: ContactMessage["status"];
          created_at?: string;
        };
        Update: Partial<Omit<ContactMessage, "id" | "created_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
