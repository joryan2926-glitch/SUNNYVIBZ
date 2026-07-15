type BookingNotificationStatus = "pending" | "confirmed" | "cancelled";

type BookingNotification = {
  to: string;
  name: string;
  title: string;
  date: string;
  kind: "atelier" | "espace";
  status: BookingNotificationStatus;
  timeSlot?: string;
};

const statusCopy: Record<BookingNotificationStatus, { subject: string; label: string; intro: string }> = {
  pending: { subject: "Votre demande SUNNYVIBZ est bien reçue", label: "Demande reçue", intro: "Notre équipe va vérifier la capacité et revenir vers vous." },
  confirmed: { subject: "Votre réservation SUNNYVIBZ est confirmée", label: "Réservation confirmée", intro: "Votre participation est confirmée par l’équipe SUNNYVIBZ." },
  cancelled: { subject: "Votre réservation SUNNYVIBZ est annulée", label: "Réservation annulée", intro: "La réservation a été annulée et la capacité a été remise à jour." },
};

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}

export async function sendBookingNotification(input: BookingNotification) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return { sent: false as const, reason: "not_configured" as const };

  const copy = statusCopy[input.status];
  const kindLabel = input.kind === "atelier" ? "Atelier" : "Espace";
  const dateLabel = escapeHtml(input.date + (input.timeSlot ? ` · ${input.timeSlot}` : ""));
  const html = `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#10251c"><p style="color:#087f55;font-weight:700;letter-spacing:.12em;text-transform:uppercase">SUNNYVIBZ · PÔLE ART &amp; CULTURE</p><h1>${escapeHtml(copy.label)}</h1><p>Bonjour ${escapeHtml(input.name)},</p><p>${escapeHtml(copy.intro)}</p><div style="border:1px solid #d6e8df;border-radius:16px;padding:20px;margin:24px 0"><p style="margin:0 0 8px"><strong>${kindLabel}</strong></p><p style="font-size:20px;margin:0 0 8px">${escapeHtml(input.title)}</p><p style="margin:0;color:#4e665b">${dateLabel}</p></div><p style="color:#4e665b">Retrouvez le suivi de vos demandes depuis votre espace membre SunnyVibz.</p></div>`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [input.to], subject: copy.subject, html, ...(process.env.RESEND_REPLY_TO ? { reply_to: process.env.RESEND_REPLY_TO } : {}) }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return { sent: false as const, reason: "provider_error" as const };
    return { sent: true as const };
  } catch {
    return { sent: false as const, reason: "network_error" as const };
  }
}
