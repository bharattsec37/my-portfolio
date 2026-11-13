import type { Metadata } from "next";
import MidnightExpress from "@/components/midnight-express/MidnightExpress";

export const metadata: Metadata = {
  title: "The Midnight Express · Bharat Patel",
  description:
    "A cinematic 3D scroll experience. Travel inside a vintage train carriage through night landscapes and explore Bharat Patel's projects, skills, and terminus.",
};

export default function MidnightExpressPage() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#030712", overflow: "hidden" }}>
      <MidnightExpress showBackToPortfolio={true} />
    </div>
  );
}
