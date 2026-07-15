import {
  fallbackArticles,
  fallbackArtists,
  fallbackCommunityPosts,
  fallbackCommunityProfiles,
  fallbackEvents,
  fallbackGallery,
  fallbackSpaces,
  fallbackSubscriptions,
  fallbackWorkshops,
} from "@/lib/data/fallbacks";
import { supabase } from "./client";
import type { Article, Artist, CommunityPost, CommunityProfile, Event, GalleryItem, Space, Subscription, Workshop } from "./types";

const eventImages: Record<string, string> = {
  "sunny-friday": "/gallery/marche-createurs.svg",
  "atelier-peinture-techniques-mixtes": "/gallery/atelier-couleurs.svg",
  "exposition-couleurs-urbaines": "/gallery/galerie-nocturne.svg",
};

const artistImages: Record<string, string> = {
  "maya-sol": "/artists/maya-sol.svg",
  "noam-vibes": "/artists/noam-vibes.svg",
  "lina-wave": "/artists/lina-wave.svg",
};


const spaceImages: Record<string, string> = {
  "creative-lab": "/gallery/creative-lab.svg",
  sunilounge: "/gallery/sunny-community.svg",
  "maison-creative": "/gallery/galerie-nocturne.svg",
};
const galleryImages: Record<string, string> = {
  "Atelier couleurs": "/gallery/atelier-couleurs.svg",
  "MarchÃ© crÃ©ateurs": "/gallery/marche-createurs.svg",
  "Galerie nocturne": "/gallery/galerie-nocturne.svg",
  "ScÃ¨ne ouverte": "/gallery/scene-ouverte.svg",
  "Creative Lab": "/gallery/creative-lab.svg",
  "CommunautÃ© Sunny": "/gallery/sunny-community.svg",
};

function mergeWithFallback<T extends { id: string }>(
  items: T[],
  fallbacks: T[],
  limit: number,
  getKey: (item: T) => string,
) {
  const seen = new Set<string>();
  const merged: T[] = [];

  for (const item of [...items, ...fallbacks]) {
    const key = getKey(item);

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    merged.push(item);

    if (merged.length >= limit) {
      break;
    }
  }

  return merged;
}

function normalizeEvent(event: Event): Event {
  return {
    ...event,
    image_url: event.image_url ?? eventImages[event.slug] ?? null,
  };
}

function normalizeArtist(artist: Artist): Artist {
  return {
    ...artist,
    image_url: artist.image_url ?? artistImages[artist.slug] ?? null,
    status: artist.status ?? "active",
  };
}

function normalizeWorkshop(workshop: Workshop): Workshop {
  const basePrice = workshop.base_price_cents ?? null;
  const subscriberPrice = workshop.subscriber_price_cents ?? basePrice;
  const creativePrice = workshop.creative_price_cents ?? subscriberPrice;
  const premiumPrice = workshop.premium_price_cents ?? creativePrice;

  return {
    ...workshop,
    base_price_cents: basePrice,
    subscriber_price_cents: subscriberPrice,
    creative_price_cents: creativePrice,
    premium_price_cents: premiumPrice,
    seats_remaining: Math.max(0, workshop.seats_remaining ?? 0),
    status:
      workshop.status === "available" && (workshop.seats_remaining ?? 0) <= 0
        ? "full"
        : workshop.status,
    requires_booking: workshop.requires_booking ?? true,
    subscriber_priority: workshop.subscriber_priority ?? false,
    access_notes: workshop.access_notes ?? null,
  };
}


function normalizeSpace(space: Space): Space {
  return {
    ...space,
    image_url: space.image_url ?? spaceImages[space.slug] ?? null,
    hourly_price_cents: space.hourly_price_cents ?? null,
    half_day_price_cents: space.half_day_price_cents ?? null,
    full_day_price_cents: space.full_day_price_cents ?? null,
    slots_remaining: Math.max(0, space.slots_remaining ?? 0),
    status:
      space.status === "available" && (space.slots_remaining ?? 0) <= 0
        ? "full"
        : space.status,
    requires_booking: space.requires_booking ?? true,
    subscriber_priority: space.subscriber_priority ?? false,
    access_notes: space.access_notes ?? null,
  };
}
function normalizeArticle(article: Article): Article {
  return {
    ...article,
    image_url: article.image_url ?? "/gallery/sunny-community.svg",
  };
}

function normalizeGalleryItem(item: GalleryItem): GalleryItem {
  return {
    ...item,
    image_url:
      !item.image_url || item.image_url === "/sunnyvibz-hero.svg"
        ? (galleryImages[item.title] ?? item.image_url)
        : item.image_url,
  };
}

export async function getEvents(limit = 12): Promise<Event[]> {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("published", true)
      .order("start_date", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("Supabase events error:", error.message);
      return fallbackEvents.slice(0, limit);
    }

    return data.length > 0
      ? mergeWithFallback(data.map(normalizeEvent), fallbackEvents, limit, (event) => event.slug)
      : fallbackEvents.slice(0, limit);
  } catch (error) {
    console.error("Supabase events request failed:", error);
    return fallbackEvents.slice(0, limit);
  }
}

export async function getArtists(limit = 12): Promise<Artist[]> {
  try {
    const { data, error } = await supabase
      .from("artists")
      .select("*")
      .eq("published", true)
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Supabase artists error:", error.message);
      return fallbackArtists.slice(0, limit);
    }

    const activeArtists = data.map(normalizeArtist).filter((artist) => artist.status === "active");

    return activeArtists.length > 0
      ? mergeWithFallback(activeArtists, fallbackArtists, limit, (artist) => artist.slug)
      : fallbackArtists.slice(0, limit);
  } catch (error) {
    console.error("Supabase artists request failed:", error);
    return fallbackArtists.slice(0, limit);
  }
}

export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  try {
    const { data, error } = await supabase
      .from("artists")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error) {
      console.error("Supabase artist profile error:", error.message);
    }

    if (data) {
    return normalizeArtist(data);
    }
  } catch (error) {
    console.error("Supabase artist profile request failed:", error);
  }

  const fallback = fallbackArtists.find((artist) => artist.slug === slug && artist.status === "active");

  return fallback ? normalizeArtist(fallback) : null;
}

export async function getWorkshops(limit = 12): Promise<Workshop[]> {
  try {
    const { data, error } = await supabase
      .from("workshops")
      .select("*")
      .eq("published", true)
      .order("start_date", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("Supabase workshops error:", error.message);
      return fallbackWorkshops.slice(0, limit);
    }

    return data.length > 0
      ? mergeWithFallback(data.map(normalizeWorkshop), fallbackWorkshops, limit, (workshop) => workshop.slug)
      : fallbackWorkshops.slice(0, limit);
  } catch (error) {
    console.error("Supabase workshops request failed:", error);
    return fallbackWorkshops.slice(0, limit);
  }
}

export async function getWorkshopBySlug(slug: string): Promise<Workshop | null> {
  try {
    const { data, error } = await supabase
      .from("workshops")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error) {
      console.error("Supabase workshop detail error:", error.message);
    }

    if (data) {
      return normalizeWorkshop(data);
    }
  } catch (error) {
    console.error("Supabase workshop detail request failed:", error);
  }

  const fallback = fallbackWorkshops.find((workshop) => workshop.slug === slug);

  return fallback ? normalizeWorkshop(fallback) : null;
}


export async function getSpaces(limit = 12): Promise<Space[]> {
  try {
    const { data, error } = await supabase
      .from("spaces")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Supabase spaces error:", error.message);
      return fallbackSpaces.slice(0, limit);
    }

    return data.length > 0
      ? mergeWithFallback(data.map(normalizeSpace), fallbackSpaces, limit, (space) => space.slug)
      : fallbackSpaces.slice(0, limit);
  } catch (error) {
    console.error("Supabase spaces request failed:", error);
    return fallbackSpaces.slice(0, limit);
  }
}

export async function getSpaceBySlug(slug: string): Promise<Space | null> {
  try {
    const { data, error } = await supabase
      .from("spaces")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error) {
      console.error("Supabase space detail error:", error.message);
    }

    if (data) {
      return normalizeSpace(data);
    }
  } catch (error) {
    console.error("Supabase space detail request failed:", error);
  }

  const fallback = fallbackSpaces.find((space) => space.slug === slug);

  return fallback ? normalizeSpace(fallback) : null;
}
function normalizeCommunityProfile(profile: CommunityProfile): CommunityProfile {
  return {
    ...profile,
    roles: profile.roles ?? [],
    skills: profile.skills ?? [],
    needs: profile.needs ?? [],
    headline: profile.headline ?? null,
    bio: profile.bio ?? null,
    avatar_url: profile.avatar_url ?? null,
    location: profile.location ?? null,
    status: profile.status ?? "active",
    published: profile.published ?? true,
  };
}

function normalizeCommunityPost(post: CommunityPost): CommunityPost {
  return {
    ...post,
    author_role: post.author_role ?? null,
    category: post.category ?? "Communauté",
    call_to_action_label: post.call_to_action_label ?? null,
    call_to_action_href: post.call_to_action_href ?? null,
    published: post.published ?? true,
  };
}

export async function getCommunityProfiles(limit = 12): Promise<CommunityProfile[]> {
  try {
    const { data, error } = await supabase
      .from("community_profiles")
      .select("*")
      .eq("published", true)
      .eq("status", "active")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Supabase community_profiles error:", error.message);
      return fallbackCommunityProfiles.slice(0, limit);
    }

    return data.length > 0
      ? mergeWithFallback(data.map(normalizeCommunityProfile), fallbackCommunityProfiles, limit, (profile) => profile.slug)
      : fallbackCommunityProfiles.slice(0, limit);
  } catch (error) {
    console.error("Supabase community_profiles request failed:", error);
    return fallbackCommunityProfiles.slice(0, limit);
  }
}

export async function getCommunityPosts(limit = 6): Promise<CommunityPost[]> {
  try {
    const { data, error } = await supabase
      .from("community_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Supabase community_posts error:", error.message);
      return fallbackCommunityPosts.slice(0, limit);
    }

    return data.length > 0
      ? mergeWithFallback(data.map(normalizeCommunityPost), fallbackCommunityPosts, limit, (post) => post.id)
      : fallbackCommunityPosts.slice(0, limit);
  } catch (error) {
    console.error("Supabase community_posts request failed:", error);
    return fallbackCommunityPosts.slice(0, limit);
  }
}
export async function getArticles(limit = 12): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Supabase articles error:", error.message);
      return fallbackArticles.slice(0, limit);
    }

    return data.length > 0
      ? mergeWithFallback(data.map(normalizeArticle), fallbackArticles, limit, (article) => article.slug)
      : fallbackArticles.slice(0, limit);
  } catch (error) {
    console.error("Supabase articles request failed:", error);
    return fallbackArticles.slice(0, limit);
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error) {
      console.error("Supabase article detail error:", error.message);
    }

    if (data) {
      return normalizeArticle(data);
    }
  } catch (error) {
    console.error("Supabase article detail request failed:", error);
  }

  const fallback = fallbackArticles.find((article) => article.slug === slug && article.status === "published");

  return fallback ? normalizeArticle(fallback) : null;
}

export async function getSubscriptions(limit = 4): Promise<Subscription[]> {
  try {
    const { data, error } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("Supabase subscription_plans error:", error.message);
      return fallbackSubscriptions.slice(0, limit);
    }

    return data.length > 0
      ? mergeWithFallback(data, fallbackSubscriptions, limit, (subscription) => subscription.slug)
      : fallbackSubscriptions.slice(0, limit);
  } catch (error) {
    console.error("Supabase subscription_plans request failed:", error);
    return fallbackSubscriptions.slice(0, limit);
  }
}

export async function getGalleryItems(limit = 12): Promise<GalleryItem[]> {
  try {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Supabase gallery error:", error.message);
      return fallbackGallery.slice(0, limit);
    }

    return data.length > 0
      ? mergeWithFallback(data.map(normalizeGalleryItem), fallbackGallery, limit, (item) => item.title)
      : fallbackGallery.slice(0, limit);
  } catch (error) {
    console.error("Supabase gallery request failed:", error);
    return fallbackGallery.slice(0, limit);
  }
}