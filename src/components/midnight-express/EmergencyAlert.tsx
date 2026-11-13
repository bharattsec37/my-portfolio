"use client";

import React from "react";
import { AlertTriangle, X, Sparkles } from "lucide-react";

interface EmergencyAlertProps {
  fact: string;
  onClose: () => void;
}

export default function EmergencyAlert({ fact, onClose }: EmergencyAlertProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: 85,
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(90%, 520px)",
        zIndex: 50,
        pointerEvents: "auto",
        animation: "emergencyDrop 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%)",
          border: "2px solid #ef4444",
          borderRadius: 14,
          padding: "16px 20px",
          color: "#fef2f2",
          boxShadow: "0 20px 50px rgba(239, 68, 68, 0.35), 0 0 25px rgba(0, 0, 0, 0.9)",
          backdropFilter: "blur(12px)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={18} color="#f87171" />
            <span style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 900, color: "#fca5a5", letterSpacing: "0.08em" }}>
              EMERGENCY BRAKE ENGAGED · EASTER EGG UNLOCKED!
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#fca5a5",
              cursor: "pointer",
              padding: 4,
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Sparkles size={20} color="#fbbf24" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: 13.5, lineHeight: 1.5, color: "#fef2f2", margin: 0, fontWeight: 500 }}>
            {fact}
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              borderRadius: 8,
              padding: "6px 14px",
              color: "#ffffff",
              fontSize: 11,
              fontFamily: "monospace",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            RELEASE BRAKE & CONTINUE 🚂
          </button>
        </div>
      </div>
    </div>
  );
}

