"use client";

import React from "react";
import { ArrowUpRight, Code2, ExternalLink, X, Sparkles } from "lucide-react";
import { StationProject } from "@/data/midnight-express-data";

interface ProjectModalProps {
  project: StationProject;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 60,
        background: "rgba(3, 7, 18, 0.8)",
        backdropFilter: "blur(12px)",
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
          width: "min(92%, 560px)",
          maxHeight: "86vh",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          background: "linear-gradient(135deg, #090d16 0%, #030712 100%)",
          border: "2px solid #38bdf8",
          borderRadius: 20,
          padding: "26px 30px",
          color: "#f8fafc",
          boxShadow: "0 25px 60px rgba(0,0,0,0.9), 0 0 35px rgba(56, 189, 248, 0.25)",
          position: "relative",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span
                style={{
                  fontSize: 10.5,
                  fontFamily: "monospace",
                  fontWeight: 900,
                  background: project.status === "Deployed" ? "rgba(34, 197, 94, 0.2)" : "rgba(56, 189, 248, 0.2)",
                  color: project.status === "Deployed" ? "#4ade80" : "#38bdf8",
                  padding: "3px 10px",
                  borderRadius: 100,
                  border: `1px solid ${project.status === "Deployed" ? "#22c55e" : "#38bdf8"}`,
                }}
              >
                {project.status === "Deployed" ? "🟢 DEPLOYED · LIVE APP" : project.status === "Winner" ? "🏆 HACKATHON WINNER" : "⚡ PROTOTYPE BUILD"}
              </span>
              <span style={{ fontSize: 11, fontFamily: "monospace", color: "#94a3b8" }}>{project.year}</span>
            </div>

            <h3 style={{ fontSize: "clamp(22px, 3.2vw, 28px)", fontWeight: 900, color: "#ffffff", margin: 0 }}>
              {project.title}
            </h3>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: "2px 0 0" }}>{project.category}</p>
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

        {/* Description */}
        <p style={{ fontSize: 14, lineHeight: 1.6, color: "#cbd5e1", margin: "14px 0" }}>
          {project.description}
        </p>

        {/* Tech Stack Pills */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontFamily: "monospace", color: "#94a3b8", fontWeight: 700, marginBottom: 6 }}>
            TECHNOLOGIES & STACK
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {project.technologies.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 11,
                  fontFamily: "monospace",
                  background: "rgba(56, 189, 248, 0.12)",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  color: "#e0f2fe",
                  padding: "4px 10px",
                  borderRadius: 6,
                  fontWeight: 600,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 16 }}>
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                border: "1px solid #4ade80",
                borderRadius: 10,
                color: "#ffffff",
                padding: "10px 20px",
                fontSize: 13,
                fontWeight: 800,
                textDecoration: "none",
                boxShadow: "0 4px 16px rgba(34, 197, 94, 0.35)",
              }}
            >
              <span>Visit Live App</span>
              <ExternalLink size={14} />
            </a>
          )}

          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 10,
                color: "#f8fafc",
                padding: "10px 18px",
                fontSize: 13,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              <Code2 size={15} />
              <span>GitHub Repository</span>
              <ArrowUpRight size={13} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
