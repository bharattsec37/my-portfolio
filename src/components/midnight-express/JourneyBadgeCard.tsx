"use client";

import React, { useState } from "react";
import { Ticket, Compass, Camera, FolderGit2, ChevronLeft, ChevronRight } from "lucide-react";

export default function JourneyBadgeCard() {
  const [collapsed, setCollapsed] = useState(true);

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setCollapsed(false);
    }
  }, []);

  if (collapsed) {
    return (
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 18,
          zIndex: 42,
          pointerEvents: "auto",
        }}
      >
        <button
          onClick={() => setCollapsed(false)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "6px 12px",
            borderRadius: 100,
            background: "rgba(12, 10, 8, 0.92)",
            border: "1px solid rgba(251, 191, 36, 0.5)",
            color: "#fbbf24",
            fontSize: 11,
            fontFamily: "serif",
            fontWeight: 800,
            cursor: "pointer",
            backdropFilter: "blur(12px)",
            boxShadow: "0 6px 20px rgba(0,0,0,0.6)",
          }}
          title="Show Journey Info"
        >
          <span>🚂 THE MIDNIGHT EXPRESS</span>
          <ChevronRight size={13} />
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 76,
        left: 20,
        zIndex: 42,
        pointerEvents: "auto",
        width: "min(88vw, 215px)",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        animation: "fadeIn 0.25s ease",
        userSelect: "none",
      }}
    >
      {/* ─── Top Header: "THE Midnight Express" with Golden Glow ─── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(true)}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            background: "transparent",
            border: "none",
            color: "rgba(255, 255, 255, 0.4)",
            cursor: "pointer",
            padding: 2,
            display: "flex",
            alignItems: "center",
          }}
          title="Minimize"
        >
          <ChevronLeft size={14} />
        </button>

        {/* Train Icon + Dash Title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            color: "#fbbf24",
            fontSize: 10.5,
            fontFamily: "monospace",
            fontWeight: 800,
            letterSpacing: "0.15em",
          }}
        >
          <span>🚂</span>
          <span>— THE —</span>
        </div>

        {/* Title: Midnight Express */}
        <h3
          style={{
            margin: "2px 0 0 0",
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: "italic",
            fontWeight: 900,
            fontSize: 23,
            lineHeight: 1.1,
            color: "#ffffff",
            textShadow: "0 0 20px rgba(251, 191, 36, 0.65), 0 2px 8px rgba(0,0,0,0.8)",
          }}
        >
          Midnight<br />Express
        </h3>

        {/* Subtitle */}
        <p
          style={{
            margin: "4px 0 0 0",
            fontSize: 10.5,
            color: "#cbd5e1",
            lineHeight: 1.3,
            fontFamily: "system-ui, sans-serif",
            textShadow: "0 1px 4px rgba(0,0,0,0.8)",
          }}
        >
          A journey through my work, skills, story and impact.
        </p>
      </div>

      {/* ─── Stitched Leather / Slate Card: "Portfolio Journey" ─── */}
      <div
        style={{
          position: "relative",
          background: "linear-gradient(135deg, rgba(20, 15, 12, 0.95) 0%, rgba(10, 8, 7, 0.96) 100%)",
          border: "1.5px solid rgba(251, 191, 36, 0.75)",
          borderRadius: 12,
          padding: "10px 12px",
          color: "#f8fafc",
          boxShadow: "0 12px 30px rgba(0,0,0,0.8), 0 0 16px rgba(251, 191, 36, 0.15)",
          backdropFilter: "blur(14px)",
        }}
      >
        {/* 4 Corner Brass Rivet Screws */}
        <div style={{ position: "absolute", top: 4, left: 4, width: 4, height: 4, borderRadius: "50%", background: "#fbbf24", boxShadow: "0 0 4px #fbbf24" }} />
        <div style={{ position: "absolute", top: 4, right: 4, width: 4, height: 4, borderRadius: "50%", background: "#fbbf24", boxShadow: "0 0 4px #fbbf24" }} />
        <div style={{ position: "absolute", bottom: 4, left: 4, width: 4, height: 4, borderRadius: "50%", background: "#fbbf24", boxShadow: "0 0 4px #fbbf24" }} />
        <div style={{ position: "absolute", bottom: 4, right: 4, width: 4, height: 4, borderRadius: "50%", background: "#fbbf24", boxShadow: "0 0 4px #fbbf24" }} />

        {/* Card Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            borderBottom: "1px solid rgba(251, 191, 36, 0.3)",
            paddingBottom: 6,
            marginBottom: 7,
          }}
        >
          <Ticket size={13} color="#fbbf24" />
          <span
            style={{
              fontSize: 11,
              fontFamily: "system-ui, sans-serif",
              fontWeight: 800,
              color: "#fbbf24",
              letterSpacing: "0.02em",
            }}
          >
            Portfolio Journey
          </span>
        </div>

        {/* 3 Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 10.5 }}>
            <Compass size={12} color="#38bdf8" />
            <span style={{ color: "#e2e8f0", fontWeight: 600 }}>4 Stations</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 10.5 }}>
            <Camera size={12} color="#4ade80" />
            <span style={{ color: "#e2e8f0", fontWeight: 600 }}>Projects to People</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 10.5 }}>
            <FolderGit2 size={12} color="#fbbf24" />
            <span style={{ color: "#e2e8f0", fontWeight: 600 }}>A Developer&apos;s Journey</span>
          </div>
        </div>
      </div>
    </div>
  );
}

