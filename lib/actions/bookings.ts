"use server";

import { supabase } from "@/lib/supabase/client";

export type BookingFormState = {
  ok: boolean;
  message: string;
};

function getValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function reserveWorkshop(
  _previousState: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  const workshopId = getValue(formData, "workshop_id");
  const name = getValue(formData, "name");
  const email = getValue(formData, "email").toLowerCase();
  const phone = getValue(formData, "phone");
  const subscriptionPlanSlug = getValue(formData, "subscription_plan_slug") || null;
  const priorityAccess = subscriptionPlanSlug === "creative" || subscriptionPlanSlug === "premium";
  const pricingNote = subscriptionPlanSlug
    ? `Formule déclarée : ${subscriptionPlanSlug}. Tarif préférentiel à confirmer par SUNNYVIBZ.`
    : "Sans formule déclarée. Tarif public à confirmer.";

  if (!workshopId || !name || !email) {
    return {
      ok: false,
      message: "Merci de renseigner votre nom, votre email et l’atelier souhaité.",
    };
  }

  try {
    const { data: workshop, error: workshopError } = await supabase
      .from("workshops")
      .select("id,title,start_date,seats_remaining,status,published,requires_booking,subscriber_priority")
      .eq("id", workshopId)
      .eq("published", true)
      .maybeSingle();

    if (workshopError || !workshop) {
      console.error("Supabase workshop booking lookup error:", workshopError?.message);
      return {
        ok: false,
        message:
          "La réservation n’est pas encore disponible pour cet atelier. Vérifiez que le SQL Supabase a bien été exécuté.",
      };
    }

    if (workshop.status !== "available" || workshop.seats_remaining <= 0) {
      return {
        ok: false,
        message: "Cet atelier est complet. Choisissez un autre créneau ou contactez SUNNYVIBZ.",
      };
    }

    const { error: bookingError } = await supabase.from("workshop_bookings").insert({
      workshop_id: workshop.id,
      workshop_title: workshop.title,
      workshop_date: workshop.start_date,
      user_id: null,
      name,
      email,
      phone: phone || null,
      subscription_plan_slug: subscriptionPlanSlug,
      pricing_note: pricingNote,
      priority_access: priorityAccess && Boolean(workshop.subscriber_priority),
      status: "pending",
    });

    if (bookingError) {
      console.error("Supabase workshop booking error:", bookingError.message);
      return {
        ok: false,
        message:
          "La réservation n’a pas pu être enregistrée. Si l’atelier vient de se remplir, réessayez ou contactez l’équipe.",
      };
    }
  } catch (error) {
    console.error("Supabase workshop booking request failed:", error);
    return {
      ok: false,
      message: "La réservation n’a pas pu être envoyée. Réessayez dans quelques instants.",
    };
  }

  return {
    ok: true,
    message:
      "Réservation envoyée. SUNNYVIBZ vérifiera la capacité, la priorité éventuelle et le tarif lié à votre formule.",
  };
}
