"use client";

import React from "react";
import { Train, ArrowRight } from "lucide-react";

interface DepartureLoaderProps {
  onEnter: () => void;
}

export default function DepartureLoader({ onEnter }: DepartureLoaderProps) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 60,
        background: "radial-gradient(circle at center, #0b1329 0%, #030712 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      {/* Vintage Railway Station Departure Board */}
      <div
        style={{
          width: "min(92%, 580px)",
          background: "#050811",
          border: "2.5px solid #b45309",
          borderRadius: 16,
          padding: "28px 32px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.9), 0 0 35px rgba(217, 119, 6, 0.25)",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(217, 119, 6, 0.15)", padding: "6px 14px", borderRadius: 100, border: "1px solid #d97706" }}>
          <Train size={16} color="#fbbf24" />
          <span style={{ fontSize: 11, fontFamily: "monospace", fontWeight: 900, color: "#fbbf24", letterSpacing: "0.1em" }}>
            STATION DEPARTURE BOARD
          </span>
        </div>

        <h2
          style={{
            fontSize: "clamp(24px, 4vw, 34px)",
            fontWeight: 900,
            color: "#f8fafc",
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          The Midnight Express
        </h2>

        <p style={{ fontSize: 13.5, color: "#94a3b8", maxWidth: 440, lineHeight: 1.6, margin: 0 }}>
          Take a window seat in a vintage night train as it travels through Bharat&apos;s engineering journey, stopping at 4 stations along the line.
        </p>

        {/* Departure Timetable Strip */}
        <div
          style={{
            width: "100%",
            background: "#090d16",
            border: "1px solid #1e293b",
            borderRadius: 10,
            padding: "12px 16px",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
            fontSize: 11,
            fontFamily: "monospace",
          }}
        >
          <div>
            <div style={{ color: "#64748b" }}>TRAIN NO.</div>
            <div style={{ color: "#f8fafc", fontWeight: 800 }}>EXP-2026</div>
          </div>
          <div>
            <div style={{ color: "#64748b" }}>PLATFORM</div>
            <div style={{ color: "#fbbf24", fontWeight: 800 }}>01 · READY</div>
          </div>
          <div>
            <div style={{ color: "#64748b" }}>DESTINATION</div>
            <div style={{ color: "#38bdf8", fontWeight: 800 }}>TERMINUS</div>
          </div>
        </div>

        {/* Boarding Button */}
        <button
          onClick={onEnter}
          style={{
            marginTop: 6,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "13px 32px",
            borderRadius: 100,
            background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
            border: "1px solid #fde047",
            color: "#ffffff",
            fontSize: 14,
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: "0 10px 25px rgba(217, 119, 6, 0.4)",
            transition: "all 0.2s ease",
          }}
        >
          <span>Board the Train</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

