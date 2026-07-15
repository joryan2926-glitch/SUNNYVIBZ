"use server";

import { supabase } from "@/lib/supabase/client";
import { sendBookingNotification } from "@/lib/notifications";

export type SpaceBookingFormState = {
  ok: boolean;
  message: string;
};

function getValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function reserveSpace(
  _previousState: SpaceBookingFormState,
  formData: FormData,
): Promise<SpaceBookingFormState> {
  const spaceId = getValue(formData, "space_id");
  const name = getValue(formData, "name");
  const email = getValue(formData, "email").toLowerCase();
  const phone = getValue(formData, "phone");
  const requestedDate = getValue(formData, "requested_date");
  const requestedTimeSlot = getValue(formData, "requested_time_slot");
  const intendedUse = getValue(formData, "intended_use");
  const subscriptionPlanSlug = getValue(formData, "subscription_plan_slug") || null;
  const priorityAccess = subscriptionPlanSlug === "creative" || subscriptionPlanSlug === "premium";
  const pricingNote = subscriptionPlanSlug
    ? `Formule déclarée : ${subscriptionPlanSlug}. Tarif espace à confirmer par SUNNYVIBZ.`
    : "Sans formule déclarée. Tarif public ou devis à confirmer.";

  if (!spaceId || !name || !email || !requestedDate || !requestedTimeSlot) {
    return {
      ok: false,
      message: "Merci de renseigner votre nom, email, date et créneau souhaité.",
    };
  }

  try {
    const { data: space, error: spaceError } = await supabase
      .from("spaces")
      .select("id,title,slots_remaining,status,published,requires_booking,subscriber_priority")
      .eq("id", spaceId)
      .eq("published", true)
      .maybeSingle();

    if (spaceError || !space) {
      console.error("Supabase space booking lookup error:", spaceError?.message);
      return {
        ok: false,
        message:
          "La réservation n’est pas encore disponible pour cet espace. Vérifiez que le SQL Supabase du module 02 a bien été exécuté.",
      };
    }

    if (space.status !== "available" || space.slots_remaining <= 0) {
      return {
        ok: false,
        message: "Cet espace n’a plus de créneau disponible. Choisissez un autre espace ou contactez SUNNYVIBZ.",
      };
    }

    const { error: bookingError } = await supabase.from("space_bookings").insert({
      space_id: space.id,
      space_title: space.title,
      requested_date: requestedDate,
      requested_time_slot: requestedTimeSlot,
      user_id: null,
      name,
      email,
      phone: phone || null,
      intended_use: intendedUse || null,
      subscription_plan_slug: subscriptionPlanSlug,
      pricing_note: pricingNote,
      priority_access: priorityAccess && Boolean(space.subscriber_priority),
      status: "pending",
    });

    if (bookingError) {
      console.error("Supabase space booking error:", bookingError.message);
      return {
        ok: false,
        message:
          "La demande n’a pas pu être enregistrée. Le créneau vient peut-être de se remplir : réessayez ou contactez l’équipe.",
      };
    }
    const notification = await sendBookingNotification({
      to: email,
      name,
      title: space.title,
      date: requestedDate,
      timeSlot: requestedTimeSlot,
      kind: "espace",
      status: "pending",
    });
    if (!notification.sent) console.info("Space booking email skipped:", notification.reason);
  } catch (error) {
    console.error("Supabase space booking request failed:", error);
    return {
      ok: false,
      message: "La demande de réservation n’a pas pu être envoyée. Réessayez dans quelques instants.",
    };
  }

  return {
    ok: true,
    message:
      "Demande envoyée. SUNNYVIBZ vérifiera le créneau, la capacité, la priorité éventuelle et le tarif lié à votre formule.",
  };
}
