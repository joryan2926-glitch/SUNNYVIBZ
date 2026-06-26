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
  featured: boolean;
  published: boolean;
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
