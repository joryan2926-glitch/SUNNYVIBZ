import type { Metadata } from "next";
import { ProfileSettingsDashboard } from "@/components/ProfileSettingsDashboard";

export const metadata: Metadata = {
  title: "Mon profil",
  description: "Gérez vos rôles, votre identité et la visibilité de votre profil SunnyVibz.",
};

export default function ProfilePage() {
  return <ProfileSettingsDashboard />;
}
