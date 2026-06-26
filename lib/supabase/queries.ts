import { fallbackArtists, fallbackEvents, fallbackGallery } from "@/lib/data/fallbacks";
import { supabase } from "./client";
import type { Artist, Event, GalleryItem } from "./types";

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

const galleryImages: Record<string, string> = {
  "Atelier couleurs": "/gallery/atelier-couleurs.svg",
  "Marché créateurs": "/gallery/marche-createurs.svg",
  "Galerie nocturne": "/gallery/galerie-nocturne.svg",
  "Scène ouverte": "/gallery/scene-ouverte.svg",
  "Creative Lab": "/gallery/creative-lab.svg",
  "Communauté Sunny": "/gallery/sunny-community.svg",
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

    return data.length > 0
      ? mergeWithFallback(data.map(normalizeArtist), fallbackArtists, limit, (artist) => artist.slug)
      : fallbackArtists.slice(0, limit);
  } catch (error) {
    console.error("Supabase artists request failed:", error);
    return fallbackArtists.slice(0, limit);
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
