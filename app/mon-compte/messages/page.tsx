import type { Metadata } from "next";
import { MessagesDashboard } from "@/components/MessagesDashboard";

export const metadata: Metadata = {
  title: "Messages",
  description: "Échangez avec l’équipe SunnyVibz, les artistes et les partenaires.",
};

export default function MessagesPage() {
  return <MessagesDashboard />;
}