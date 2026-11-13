"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight, Award, GraduationCap, MapPin, X, FileText } from "lucide-react";
import { ABOUT_STATION } from "@/data/midnight-express-data";

interface AboutStationModalProps {
  onClose: () => void;
}

export default function AboutStationModal({ onClose }: AboutStationModalProps) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 60,
        background: "rgba(3, 7, 18, 0.85)",
        backdropFilter: "blur(14px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        animation: "fadeIn 0.25s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "min(94%, 640px)",
          maxHeight: "88vh",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          background: "linear-gradient(135deg, #090d16 0%, #030712 100%)",
          border: "2px solid #fbbf24",
          borderRadius: 22,
          padding: "26px 30px",
          color: "#f8fafc",
          boxShadow: "0 25px 60px rgba(0,0,0,0.95), 0 0 35px rgba(251, 191, 36, 0.25)",
          position: "relative",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                overflow: "hidden",
                position: "relative",
                border: "2px solid #fbbf24",
                flexShrink: 0,
              }}
            >
              <Image src="/images/bharat-patel.webp" alt="Bharat Patel" fill style={{ objectFit: "cover" }} />
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, fontFamily: "monospace", color: "#fbbf24", fontWeight: 800 }}>
                  ABOUT TOWN · PASSENGER DOSSIER
                </span>
              </div>
              <h3 style={{ fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 900, color: "#ffffff", margin: 0 }}>
                {ABOUT_STATION.name}
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#94a3b8", fontSize: 12, marginTop: 2 }}>
                <MapPin size={13} color="#38bdf8" />
                <span>{ABOUT_STATION.location}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 8,
              color: "#cbd5e1",
              cursor: "pointer",
              padding: 6,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Motto quote */}
        <blockquote
          style={{
            margin: "12px 0 16px",
            padding: "10px 16px",
            background: "rgba(251, 191, 36, 0.08)",
            borderLeft: "3px solid #fbbf24",
            borderRadius: "0 8px 8px 0",
            fontSize: 13,
            fontStyle: "italic",
            color: "#fde68a",
          }}
        >
          &ldquo;{ABOUT_STATION.motto}&rdquo;
        </blockquote>

        <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "#cbd5e1", margin: "12px 0" }}>
          {ABOUT_STATION.bio}
        </p>

        {/* Education & Roles */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, margin: "16px 0" }}>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#38bdf8", fontSize: 12, fontWeight: 800, marginBottom: 6 }}>
              <GraduationCap size={15} />
              <span>EDUCATION</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#f8fafc" }}>
              {ABOUT_STATION.education.degree}
            </div>
            <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 2 }}>
              {ABOUT_STATION.education.college}
            </div>
            <div style={{ fontSize: 10.5, fontFamily: "monospace", color: "#fbbf24", marginTop: 4 }}>
              {ABOUT_STATION.education.batch}
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#fbbf24", fontSize: 12, fontWeight: 800, marginBottom: 6 }}>
              <Award size={15} />
              <span>VERIFIED WINS & HONORS</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: "#cbd5e1", lineHeight: 1.5 }}>
              {ABOUT_STATION.achievements.slice(0, 5).map((ach, i) => (
                <li key={i}>{ach}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 16 }}>
          <a
            href="/bharat-patel-resume.pdf"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#1e293b",
              border: "1px solid #475569",
              borderRadius: 10,
              color: "#f8fafc",
              padding: "10px 18px",
              fontSize: 12.5,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            <FileText size={14} />
            <span>Download Resume PDF</span>
            <ArrowUpRight size={13} />
          </a>

          <a
            href="mailto:bharatpatelk2005@gmail.com"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "linear-gradient(135deg, #245BFF 0%, #754BFF 100%)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 10,
              color: "#ffffff",
              padding: "10px 20px",
              fontSize: 12.5,
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            <span>Send Email</span>
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}

