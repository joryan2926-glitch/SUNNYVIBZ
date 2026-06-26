import { fallbackArtists, fallbackEvents, fallbackGallery } from "@/lib/data/fallbacks";
import { supabase } from "./client";
import type { Artist, Event, GalleryItem } from "./types";

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

    return data.length > 0 ? data : fallbackEvents.slice(0, limit);
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

    return data.length > 0 ? data : fallbackArtists.slice(0, limit);
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

    return data.length > 0 ? data : fallbackGallery.slice(0, limit);
  } catch (error) {
    console.error("Supabase gallery request failed:", error);
    return fallbackGallery.slice(0, limit);
  }
}
