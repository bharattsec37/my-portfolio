"use client";

import React from "react";
import { STATIONS } from "@/data/midnight-express-data";

interface DepartureBoardProps {
  currentStationIdx: number;
  isStopped: boolean;
  speed: number;
}

export default function DepartureBoard({
  currentStationIdx,
  isStopped,
  speed,
}: DepartureBoardProps) {
  const station = STATIONS[currentStationIdx] || STATIONS[0];
  const kmh = Math.round(speed * 92);

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 30,
        pointerEvents: "none",
        width: "min(92%, 560px)",
      }}
    >
      <div
        style={{
          background: "linear-gradient(180deg, #0f172a 0%, #020617 100%)",
          border: "2px solid #334155",
          borderRadius: 12,
          padding: "10px 18px",
          boxShadow: "0 12px 36px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.1)",
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        {/* Left: Express Status */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: isStopped ? "#ef4444" : "#22c55e",
                boxShadow: `0 0 10px ${isStopped ? "#ef4444" : "#22c55e"}`,
                animation: isStopped ? "pulse 1.2s infinite" : "none",
              }}
            />
            <span
              style={{
                fontSize: 10,
                fontFamily: "monospace",
                fontWeight: 800,
                color: isStopped ? "#fca5a5" : "#86efac",
                letterSpacing: "0.08em",
              }}
            >
              {isStopped ? "PLATFORM STOPPED" : "THE MIDNIGHT EXPRESS · IN TRANSIT"}
            </span>
          </div>

          <div
            style={{
              fontSize: "clamp(15px, 2.2vw, 19px)",
              fontWeight: 900,
              color: "#f8fafc",
              letterSpacing: "-0.01em",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            {station.name}
          </div>
        </div>

        {/* Right: Telemetry Indicators */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            borderLeft: "1px solid rgba(255,255,255,0.12)",
            paddingLeft: 14,
          }}
        >
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, fontFamily: "monospace", color: "#94a3b8", fontWeight: 700 }}>
              SPEED
            </div>
            <div style={{ fontSize: 16, fontFamily: "monospace", fontWeight: 900, color: "#fbbf24" }}>
              {kmh} <span style={{ fontSize: 10, color: "#94a3b8" }}>KM/H</span>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, fontFamily: "monospace", color: "#94a3b8", fontWeight: 700 }}>
              CODE
            </div>
            <div style={{ fontSize: 14, fontFamily: "monospace", fontWeight: 900, color: "#38bdf8" }}>
              {station.code}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

