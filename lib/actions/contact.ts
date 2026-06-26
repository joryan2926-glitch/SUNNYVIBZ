"use server";

import { supabase } from "@/lib/supabase/client";

export type ContactFormState = {
  ok: boolean;
  message: string;
};

function getValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitContactMessage(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = getValue(formData, "name");
  const email = getValue(formData, "email");
  const subject = getValue(formData, "subject");
  const message = getValue(formData, "message");

  if (!name || !email || !message) {
    return {
      ok: false,
      message: "Merci de renseigner votre nom, votre email et votre message.",
    };
  }

  try {
    const { error } = await supabase.from("contact_messages").insert({
      name,
      email,
      subject: subject || null,
      message,
    });

    if (error) {
      console.error("Supabase contact message error:", error.message);
      return {
        ok: false,
        message: "Le message n’a pas pu être envoyé. Réessayez dans quelques instants.",
      };
    }
  } catch (error) {
    console.error("Supabase contact message request failed:", error);
    return {
      ok: false,
      message: "Le message n’a pas pu être envoyé. Réessayez dans quelques instants.",
    };
  }

  return {
    ok: true,
    message: "Message envoyé. L’équipe SUNNYVIBZ revient vers vous très vite.",
  };
}
