"use client";

import dynamic from "next/dynamic";

const HeroCanvas = dynamic(() => import("@/components/hero-canvas"), {
  ssr: false,
  loading: () => <div className="orb-fallback" aria-hidden="true"><span /></div>,
});

export default function HeroOrb() {
  return <div className="hero-orb"><HeroCanvas /></div>;
}