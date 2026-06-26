"use server";

import { supabase } from "@/lib/supabase/client";

export type SunnyFridayApplicationState = {
  ok: boolean;
  message: string;
};

type SunnyFridayApplicationClient = {
  from: (table: "sunny_friday_applications") => {
    insert: (payload: Record<string, unknown>) => Promise<{ error: { message: string } | null }>;
  };
};

function getValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitSunnyFridayApplication(
  _previousState: SunnyFridayApplicationState,
  formData: FormData,
): Promise<SunnyFridayApplicationState> {
  const name = getValue(formData, "name");
  const email = getValue(formData, "email").toLowerCase();
  const phone = getValue(formData, "phone");
  const projectName = getValue(formData, "project_name");
  const discipline = getValue(formData, "discipline");
  const needs = getValue(formData, "needs");

  if (!name || !email || !projectName) {
    return {
      ok: false,
      message: "Merci de renseigner votre nom, votre email et le nom du projet.",
    };
  }

  try {
    const applicationClient = supabase as unknown as SunnyFridayApplicationClient;
    const { error } = await applicationClient.from("sunny_friday_applications").insert({
      name,
      email,
      phone: phone || null,
      project_name: projectName,
      discipline: discipline || null,
      needs: needs || null,
      status: "pending",
    });

    if (error) {
      console.error("Sunny Friday application error:", error.message);
      return {
        ok: false,
        message:
          "La candidature n’a pas pu être enregistrée. Vérifiez que le SQL Supabase a été exécuté.",
      };
    }
  } catch (error) {
    console.error("Sunny Friday application request failed:", error);
    return {
      ok: false,
      message: "La candidature n’a pas pu être envoyée. Réessayez dans quelques instants.",
    };
  }

  return {
    ok: true,
    message: "Candidature envoyée. L’équipe SUNNYVIBZ revient vers vous pour le stand.",
  };
}
