"use client";

import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { STATIONS } from "@/data/midnight-express-data";

interface RouteMapProps {
  currentStationIdx: number;
  progress: number;
  onSelectStation: (idx: number) => void;
  isMuted: boolean;
  onToggleAudio: () => void;
  onSkipToTerminus: () => void;
}

// ─── Glowing Aerodynamic Express Train Icon (Matching Reference) ─────────────

function GlowingExpressTrainIcon() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 0, position: "relative" }}>
      <svg
        width="60"
        height="26"
        viewBox="0 0 60 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: "drop-shadow(0 0 8px rgba(251, 191, 36, 0.9)) drop-shadow(0 0 16px rgba(251, 191, 36, 0.4))",
        }}
      >
        {/* Trailing speed streaks */}
        <line x1="2" y1="13" x2="16" y2="13" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <line x1="6" y1="15.5" x2="18" y2="15.5" stroke="#fbbf24" strokeWidth="1.3" strokeLinecap="round" opacity="0.85" />
        <line x1="0" y1="17.5" x2="16" y2="17.5" stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round" opacity="0.45" />

        {/* Roof Unit / Pantograph bar */}
        <rect x="23" y="3" width="18" height="2" rx="1" fill="#fef08a" />

        {/* Train Carriage Main Body */}
        <path
          d="M18 5 H43 Q47.5 5 51 9.5 L53.5 13.5 Q54.5 15.5 52.5 16.5 H19 Q17 16.5 17 14.5 V7 Q17 5 18 5 Z"
          fill="#fef08a"
          stroke="#fbbf24"
          strokeWidth="1.2"
        />

        {/* Side Passenger Windows */}
        <rect x="20.5" y="7.5" width="4.5" height="4.8" rx="0.8" fill="#0b0f19" />
        <rect x="27.5" y="7.5" width="4.5" height="4.8" rx="0.8" fill="#0b0f19" />
        <rect x="34.5" y="7.5" width="4.5" height="4.8" rx="0.8" fill="#0b0f19" />

        {/* Train Door Line */}
        <line x1="41" y1="7" x2="41" y2="16" stroke="#0b0f19" strokeWidth="1.3" />

        {/* Front Aerodynamic Windshield */}
        <path
          d="M43.5 7.5 H46.5 Q49 7.5 51 10.5 L51.8 13 H43.5 V7.5 Z"
          fill="#0b0f19"
        />

        {/* Undercarriage Chassis Skirt */}
        <path d="M20 16.5 H50 L49 18.2 H21 Z" fill="#fbbf24" />

        {/* Dual Wheel Bogies */}
        {/* Rear pair */}
        <circle cx="24.5" cy="20.5" r="2.3" stroke="#fef08a" strokeWidth="1.3" fill="#0b0f19" />
        <circle cx="29.5" cy="20.5" r="2.3" stroke="#fef08a" strokeWidth="1.3" fill="#0b0f19" />
        <line x1="24.5" y1="20.5" x2="29.5" y2="20.5" stroke="#fef08a" strokeWidth="1" />

        {/* Front pair */}
        <circle cx="41.5" cy="20.5" r="2.3" stroke="#fef08a" strokeWidth="1.3" fill="#0b0f19" />
        <circle cx="46.5" cy="20.5" r="2.3" stroke="#fef08a" strokeWidth="1.3" fill="#0b0f19" />
        <line x1="41.5" y1="20.5" x2="46.5" y2="20.5" stroke="#fef08a" strokeWidth="1" />
      </svg>

      {/* Rail track extending out from under the train with ties */}
      <div
        style={{
          display: "none",
          flexDirection: "column",
          gap: 2,
          marginBottom: 3,
          marginLeft: -2,
        }}
        className="md:flex"
      >
        <div
          style={{
            width: 28,
            height: 2,
            background: "linear-gradient(90deg, #fef08a 0%, #fbbf24 100%)",
            boxShadow: "0 0 8px rgba(251, 191, 36, 0.8)",
          }}
        />
        <div
          style={{
            width: 28,
            height: 3,
            background: "repeating-linear-gradient(90deg, #fbbf24 0, #fbbf24 2.5px, transparent 2.5px, transparent 6px)",
            opacity: 0.6,
          }}
        />
      </div>
    </div>
  );
}

export default function RouteMap({
  currentStationIdx,
  progress,
  onSelectStation,
  onSkipToTerminus,
}: RouteMapProps) {
  const stationTargetProgress = [0.20, 0.45, 0.70, 1.00];

  return (
    <div
      style={{
        position: "absolute",
        bottom: 14,
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(96%, 1060px)",
        zIndex: 35,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        padding: "6px 12px",
        background: "rgba(10, 14, 24, 0.94)",
        border: "1.5px solid rgba(251, 191, 36, 0.3)",
        borderRadius: 100,
        backdropFilter: "blur(18px)",
        boxShadow: "0 12px 40px rgba(0, 0, 0, 0.85), 0 0 24px rgba(251, 191, 36, 0.15)",
      }}
    >
      {/* ─── Left: Glowing Aerodynamic Train Icon on Rails (Image 2) ─── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexShrink: 0,
          paddingLeft: 2,
        }}
        className="hidden xs:flex scale-85 sm:scale-100 origin-left"
      >
        <GlowingExpressTrainIcon />
      </div>

      {/* ─── Center: 4 Station Capsule Waypoint Buttons Connected by Rails ─── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          flex: 1,
          justifyContent: "center",
          overflowX: "auto",
        }}
      >
        {STATIONS.map((stn, idx) => {
          const isActive = currentStationIdx === idx;
          const isPassed = progress >= stationTargetProgress[idx] - 0.05;
          const shortNames = ["01 PRJ", "02 SKL", "03 ABT", "04 TRM"];

          return (
            <button
              key={stn.id}
              onClick={() => onSelectStation(idx)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 11px",
                borderRadius: 100,
                background: isActive
                  ? "rgba(251, 191, 36, 0.22)"
                  : isPassed
                  ? "rgba(56, 189, 248, 0.1)"
                  : "rgba(255, 255, 255, 0.04)",
                border: isActive
                  ? "1.5px solid #fbbf24"
                  : isPassed
                  ? "1px solid rgba(56, 189, 248, 0.4)"
                  : "1px solid rgba(255, 255, 255, 0.12)",
                color: isActive ? "#fbbf24" : isPassed ? "#f8fafc" : "#94a3b8",
                cursor: "pointer",
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                boxShadow: isActive ? "0 0 16px rgba(251, 191, 36, 0.45)" : "none",
                whiteSpace: "nowrap",
                fontSize: 11.5,
                fontWeight: 700,
              }}
            >
              {/* Status Indicator Dot / Pin */}
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: isActive ? "#fbbf24" : isPassed ? "#38bdf8" : "#475569",
                  boxShadow: isActive ? "0 0 8px #fbbf24" : "none",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              <span className="hidden sm:inline">{stn.name.split(":")[0]}</span>
              <span className="inline sm:hidden">{shortNames[idx]}</span>
              <span
                style={{
                  fontSize: 10,
                  fontFamily: "monospace",
                  color: isActive ? "#fef08a" : "#64748b",
                  background: "rgba(0, 0, 0, 0.35)",
                  padding: "1px 5px",
                  borderRadius: 10,
                }}
                className="hidden md:inline"
              >
                {idx + 1}/4
              </span>
            </button>
          );
        })}
      </div>

      {/* ─── Right: Skip Journey / Contact Pill Button ─── */}
      <button
        onClick={onSkipToTerminus}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          background: "linear-gradient(135deg, rgba(36, 91, 255, 0.9) 0%, rgba(117, 75, 255, 0.9) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.25)",
          padding: "6px 13px",
          borderRadius: 100,
          color: "#ffffff",
          fontSize: 11.5,
          fontWeight: 800,
          cursor: "pointer",
          flexShrink: 0,
          boxShadow: "0 4px 18px rgba(36, 91, 255, 0.5)",
          transition: "all 0.2s ease",
        }}
      >
        <span className="hidden sm:inline">Skip Journey / Contact</span>
        <span className="inline sm:hidden">Skip</span>
        <ArrowRight size={12} />
      </button>
    </div>
  );
}
