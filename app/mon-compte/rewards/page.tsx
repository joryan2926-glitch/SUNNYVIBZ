import type { Metadata } from "next";
import { RewardsDashboard } from "@/components/RewardsDashboard";

export const metadata: Metadata = {
  title: "SUNNY Rewards",
  description: "Gagnez des points et débloquez des avantages grâce à votre engagement SunnyVibz.",
};

export default function RewardsPage() {
  return <RewardsDashboard />;
}