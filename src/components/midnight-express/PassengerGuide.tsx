"use client";

import React, { useState } from "react";
import { HelpCircle, MousePointer, ChevronDown, ChevronUp, Bell, Compass, ArrowUpDown } from "lucide-react";

export default function PassengerGuide() {
  const [isOpen, setIsOpen] = useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setIsOpen(true);
    }
  }, []);

  if (!isOpen) {
    return (
      <div
        style={{
          position: "absolute",
          bottom: 64,
          right: 18,
          zIndex: 45,
          pointerEvents: "auto",
        }}
      >
        <button
          onClick={() => setIsOpen(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "5px 11px",
            borderRadius: 100,
            background: "rgba(10, 14, 26, 0.92)",
            border: "1px solid rgba(251, 191, 36, 0.5)",
            color: "#fbbf24",
            fontSize: 10.5,
            fontFamily: "monospace",
            fontWeight: 800,
            cursor: "pointer",
            backdropFilter: "blur(12px)",
            boxShadow: "0 6px 20px rgba(0,0,0,0.6)",
          }}
        >
          <HelpCircle size={12} color="#fbbf24" />
          <span>CONTROLS</span>
          <ChevronUp size={12} />
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        bottom: 64,
        right: 18,
        zIndex: 45,
        pointerEvents: "auto",
        width: "min(85vw, 220px)",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        style={{
          background: "rgba(8, 12, 22, 0.95)",
          border: "1px solid rgba(251, 191, 36, 0.8)",
          borderRadius: 12,
          padding: "8px 11px",
          color: "#f8fafc",
          boxShadow: "0 10px 30px rgba(0,0,0,0.85), 0 0 14px rgba(251, 191, 36, 0.15)",
          backdropFilter: "blur(16px)",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(251, 191, 36, 0.2)",
            paddingBottom: 5,
            marginBottom: 6,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Compass size={12} color="#fbbf24" />
            <span
              style={{
                fontSize: 9.5,
                fontFamily: "monospace",
                fontWeight: 900,
                color: "#fbbf24",
                letterSpacing: "0.06em",
              }}
            >
              CONTROLS
            </span>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              padding: 1,
              display: "flex",
              alignItems: "center",
            }}
            title="Minimize guide"
          >
            <ChevronDown size={13} />
          </button>
        </div>

        {/* Compact Instructions List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {/* Scroll instruction */}
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div
              style={{
                background: "rgba(56, 189, 248, 0.12)",
                border: "1px solid rgba(56, 189, 248, 0.25)",
                borderRadius: 4,
                padding: "3px 4px",
                flexShrink: 0,
                color: "#38bdf8",
                display: "flex",
              }}
            >
              <ArrowUpDown size={11} />
            </div>
            <div style={{ fontSize: 10, lineHeight: 1.25 }}>
              <span style={{ color: "#ffffff", fontWeight: 700 }}>Scroll / Swipe:</span>{" "}
              <span style={{ color: "#94a3b8" }}>Move train</span>
            </div>
          </div>

          {/* Click Posters instruction */}
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div
              style={{
                background: "rgba(34, 197, 94, 0.12)",
                border: "1px solid rgba(34, 197, 94, 0.25)",
                borderRadius: 4,
                padding: "3px 4px",
                flexShrink: 0,
                color: "#4ade80",
                display: "flex",
              }}
            >
              <MousePointer size={11} />
            </div>
            <div style={{ fontSize: 10, lineHeight: 1.25 }}>
              <span style={{ color: "#ffffff", fontWeight: 700 }}>Click Posters:</span>{" "}
              <span style={{ color: "#94a3b8" }}>Open live demo</span>
            </div>
          </div>

          {/* Route Map Station buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div
              style={{
                background: "rgba(251, 191, 36, 0.12)",
                border: "1px solid rgba(251, 191, 36, 0.25)",
                borderRadius: 4,
                padding: "3px 4px",
                flexShrink: 0,
                color: "#fbbf24",
                display: "flex",
              }}
            >
              <Compass size={11} />
            </div>
            <div style={{ fontSize: 10, lineHeight: 1.25 }}>
              <span style={{ color: "#ffffff", fontWeight: 700 }}>Station Pills:</span>{" "}
              <span style={{ color: "#94a3b8" }}>Jump station</span>
            </div>
          </div>

          {/* Emergency chain easter egg */}
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div
              style={{
                background: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.25)",
                borderRadius: 4,
                padding: "3px 4px",
                flexShrink: 0,
                color: "#f87171",
                display: "flex",
              }}
            >
              <Bell size={11} />
            </div>
            <div style={{ fontSize: 10, lineHeight: 1.25 }}>
              <span style={{ color: "#ffffff", fontWeight: 700 }}>Red Chain:</span>{" "}
              <span style={{ color: "#94a3b8" }}>Surprise fact</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
