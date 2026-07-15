"use server";

import { supabase } from "@/lib/supabase/client";

export type MarketInquiryState = {
  ok: boolean;
  message: string;
};

function getValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

type MarketInquiryClient = {
  from: (table: "market_inquiries") => {
    insert: (payload: Record<string, unknown>) => Promise<{ error: { message: string } | null }>;
  };
};

export async function submitMarketInquiry(
  _previousState: MarketInquiryState,
  formData: FormData,
): Promise<MarketInquiryState> {
  const offerId = getValue(formData, "offer_id");
  const name = getValue(formData, "name");
  const email = getValue(formData, "email").toLowerCase();
  const phone = getValue(formData, "phone");
  const message = getValue(formData, "message");

  if (!offerId || !name || !email || message.length < 10) {
    return {
      ok: false,
      message: "Merci de renseigner vos coordonnées et une demande d’au moins 10 caractères.",
    };
  }

  try {
    const marketClient = supabase as unknown as MarketInquiryClient;
    const { error } = await marketClient.from("market_inquiries").insert({
      offer_id: offerId,
      user_id: null,
      name,
      email,
      phone: phone || null,
      message,
      status: "new",
    });

    if (error) {
      console.error("Supabase market inquiry error:", error.message);
      return {
        ok: false,
        message: "La demande n’a pas pu être enregistrée. Réessayez dans quelques instants.",
      };
    }
  } catch (error) {
    console.error("Supabase market inquiry request failed:", error);
    return {
      ok: false,
      message: "La demande n’a pas pu être envoyée. Réessayez dans quelques instants.",
    };
  }

  return {
    ok: true,
    message: "Votre demande est bien enregistrée. SUNNYVIBZ reviendra vers vous rapidement.",
  };
}
