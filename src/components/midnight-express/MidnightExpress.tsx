"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Sparkles, Volume2, VolumeX, Zap } from "lucide-react";
import DepartureBoard from "./DepartureBoard";
import RouteMap from "./RouteMap";
import TrainTicket from "./TrainTicket";
import EmergencyAlert from "./EmergencyAlert";
import DepartureLoader from "./DepartureLoader";
import ProjectModal from "./ProjectModal";
import AboutStationModal from "./AboutStationModal";
import PassengerGuide from "./PassengerGuide";
import JourneyBadgeCard from "./JourneyBadgeCard";
import { trainAudio } from "./TrainAudio";
import { EASTER_EGG_FACTS, StationProject, PROJECTS_DATA } from "@/data/midnight-express-data";
import type { PerformanceMode } from "./CarriageCanvas";

const CarriageCanvas = dynamic(() => import("./CarriageCanvas"), {
  ssr: false,
  loading: () => <div style={{ position: "absolute", inset: 0, background: "#030712" }} />,
});

interface MidnightExpressProps {
  showBackToPortfolio?: boolean;
}

export default function MidnightExpress({ showBackToPortfolio = false }: MidnightExpressProps) {
  const [boarded, setBoarded] = useState(false);
  const [progress, setProgress] = useState(0.0);
  const [targetProgress, setTargetProgress] = useState(0.0);
  const [speed, setSpeed] = useState(0.8);
  const [currentStationIdx, setCurrentStationIdx] = useState(0);
  const [isStopped, setIsStopped] = useState(false);
  const [isEmergencyBraked, setIsEmergencyBraked] = useState(false);
  const [emergencyFact, setEmergencyFact] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [performanceMode, setPerformanceMode] = useState<PerformanceMode>("balanced");
  const [isInView, setIsInView] = useState(true);

  // Modals for deep inspection
  const [selectedProject, setSelectedProject] = useState<StationProject | null>(null);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const stationTargetProgress = [0.20, 0.45, 0.70, 1.00];

  // Touch tracking refs for mobile swipe
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  // Auto-detect performance mode & restore preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bp_perf_mode") as PerformanceMode | null;
      if (saved && ["ultra", "balanced", "lite"].includes(saved)) {
        setPerformanceMode(saved);
        return;
      }
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const cores = navigator.hardwareConcurrency || 4;
      const isMobile = window.innerWidth < 768;

      if (prefersReducedMotion || cores <= 2) {
        setPerformanceMode("lite");
      } else if (isMobile || cores <= 4) {
        setPerformanceMode("balanced");
      } else {
        setPerformanceMode("ultra");
      }
    } catch {
      setPerformanceMode("balanced");
    }
  }, []);

  const handleCyclePerfMode = () => {
    setPerformanceMode((prev) => {
      const next: PerformanceMode = prev === "ultra" ? "balanced" : prev === "balanced" ? "lite" : "ultra";
      try {
        localStorage.setItem("bp_perf_mode", next);
      } catch {}
      return next;
    });
  };

  // IntersectionObserver: Pause RAF & WebGL when scrolled out of viewport (0% CPU/GPU waste)
  useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: "100px" }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setIsMuted(trainAudio.getMuted());
  }, []);

  const handleBoard = () => {
    setBoarded(true);
    trainAudio.startRhythm();
  };

  const handleToggleAudio = () => {
    const muted = trainAudio.toggleMute();
    setIsMuted(muted);
  };

  const handlePullEmergencyChain = () => {
    setIsEmergencyBraked(true);
    trainAudio.playEmergencyBrake();
    const randomFact = EASTER_EGG_FACTS[Math.floor(Math.random() * EASTER_EGG_FACTS.length)];
    setEmergencyFact(randomFact);
  };

  const handleCloseEmergency = () => {
    setIsEmergencyBraked(false);
    setEmergencyFact(null);
  };

  const handleSelectStation = useCallback((idx: number) => {
    setTargetProgress(stationTargetProgress[idx]);
    setCurrentStationIdx(idx);
    trainAudio.playStationChime();
  }, [stationTargetProgress]);

  const handleSkipToTerminus = useCallback(() => {
    setTargetProgress(1.0);
    setCurrentStationIdx(3);
    trainAudio.playStationChime();
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    if (isEmergencyBraked || selectedProject || showAboutModal) return;
    const delta = e.deltaY * 0.0006;
    setTargetProgress((prev) => Math.min(1.0, Math.max(0.0, prev + delta)));
  };

  // Touch Swipe Gesture for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isEmergencyBraked || selectedProject || showAboutModal) return;
    if (touchStartY.current === null || touchStartX.current === null) return;

    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;
    const deltaY = touchStartY.current - currentY;
    const deltaX = touchStartX.current - currentX;

    const dominantDelta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;

    if (Math.abs(dominantDelta) > 4) {
      const progressDelta = dominantDelta * 0.0008;
      setTargetProgress((prev) => Math.min(1.0, Math.max(0.0, prev + progressDelta)));
      touchStartY.current = currentY;
      touchStartX.current = currentX;
    }
  };

  const handleTouchEnd = () => {
    touchStartY.current = null;
    touchStartX.current = null;
  };

  useEffect(() => {
    if (!isInView) return; // Completely halts RAF when scrolled out of viewport!

    let animationFrameId: number;

    const tick = () => {
      setProgress((prev) => {
        const diff = targetProgress - prev;
        const next = Math.abs(diff) < 0.0005 ? targetProgress : prev + diff * 0.08;

        let minStationDist = 999;
        let nearestIdx = 0;
        stationTargetProgress.forEach((stnProg, idx) => {
          const dist = Math.abs(next - stnProg);
          if (dist < minStationDist) {
            minStationDist = dist;
            nearestIdx = idx;
          }
        });

        setCurrentStationIdx(nearestIdx);

        if (minStationDist < 0.04) {
          setIsStopped(true);
          setSpeed(isEmergencyBraked ? 0 : 0.08);
        } else {
          setIsStopped(false);
          setSpeed(isEmergencyBraked ? 0 : 0.85);
        }

        return next;
      });

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, targetProgress, isEmergencyBraked, stationTargetProgress]);

  const atTerminus = progress >= 0.95;

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        position: "relative",
        width: "100%",
        height: "clamp(500px, 80vh, 840px)",
        background: "#030712",
        borderRadius: 24,
        overflow: "hidden",
        border: "2px solid rgba(251, 191, 36, 0.4)",
        boxShadow: "0 30px 80px rgba(0, 0, 0, 0.95), 0 0 50px rgba(217, 119, 6, 0.25)",
        userSelect: "none",
        touchAction: "pan-y",
      }}
    >
      {/* 3D R3F WebGL Scene */}
      <CarriageCanvas
        progress={progress}
        speed={speed}
        isEmergencyBraked={isEmergencyBraked}
        onPullEmergencyChain={handlePullEmergencyChain}
        onSelectProject={(proj) => setSelectedProject(proj)}
        onOpenAboutModal={() => setShowAboutModal(true)}
        performanceMode={performanceMode}
        isVisible={isInView}
      />

      {/* Photorealistic Luxury Train Carriage Window Frame Overlay (Exact Frame Uploaded by User) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 20,
          backgroundImage: "url('/midnight-express-frame.png')",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Top Left: Back to Portfolio Button & Brand Header (Matching Reference) */}
      <div
        style={{
          position: "absolute",
          top: 18,
          left: 20,
          zIndex: 45,
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Link
          href="/#midnight-express"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "7px 15px",
            borderRadius: 100,
            background: "rgba(10, 14, 26, 0.9)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#f8fafc",
            fontSize: 12,
            fontFamily: "system-ui, sans-serif",
            fontWeight: 700,
            textDecoration: "none",
            backdropFilter: "blur(12px)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
            transition: "all 0.2s ease",
          }}
        >
          <ArrowLeft size={14} />
          <span>Back to Portfolio</span>
        </Link>

        {/* Monogram / Title Badge */}
        <div
          style={{
            display: "none",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            borderRadius: 100,
            background: "rgba(10, 14, 26, 0.82)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            backdropFilter: "blur(12px)",
          }}
          className="md:inline-flex"
        >
          <span style={{ fontWeight: 900, color: "#ffffff", fontSize: 13, letterSpacing: "-0.5px" }}>BP</span>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
          <span style={{ color: "#f8fafc", fontSize: 12, fontWeight: 700 }}>Bharat Patel</span>
          <span style={{ color: "#94a3b8", fontSize: 11, marginLeft: 2 }}>Developer · Engineer · Entrepreneur</span>
        </div>
      </div>

      {/* Left Side: "THE Midnight Express" + Stitched "Portfolio Journey" Card (Image 2) */}
      <JourneyBadgeCard />

      {/* Top Right: Adaptive Performance Mode & Sound On/Off Pill Buttons */}
      <div
        style={{
          position: "absolute",
          top: 18,
          right: 20,
          zIndex: 45,
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {/* Adaptive Performance Mode Switcher (Ultra / Balanced / Lite) */}
        <button
          onClick={handleCyclePerfMode}
          title={`Performance Mode: ${performanceMode.toUpperCase()} (Click to toggle)`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "7px 13px",
            borderRadius: 100,
            background: "rgba(10, 14, 26, 0.9)",
            border:
              performanceMode === "ultra"
                ? "1.5px solid #a855f7"
                : performanceMode === "balanced"
                ? "1.5px solid #38bdf8"
                : "1.5px solid #4ade80",
            color:
              performanceMode === "ultra"
                ? "#c084fc"
                : performanceMode === "balanced"
                ? "#7dd3fc"
                : "#86efac",
            fontSize: 11.5,
            fontFamily: "monospace",
            fontWeight: 800,
            cursor: "pointer",
            backdropFilter: "blur(12px)",
            boxShadow:
              performanceMode === "ultra"
                ? "0 0 14px rgba(168, 85, 247, 0.4)"
                : performanceMode === "balanced"
                ? "0 0 14px rgba(56, 189, 248, 0.35)"
                : "0 0 14px rgba(74, 222, 128, 0.35)",
            transition: "all 0.2s ease",
          }}
        >
          <Zap size={13} />
          <span>
            {performanceMode === "ultra"
              ? "⚡ ULTRA"
              : performanceMode === "balanced"
              ? "⚖️ BALANCED"
              : "🍃 LITE"}
          </span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={handleToggleAudio}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 15px",
            borderRadius: 100,
            background: "rgba(10, 14, 26, 0.9)",
            border: isMuted ? "1px solid rgba(255, 255, 255, 0.18)" : "1.5px solid #22c55e",
            color: isMuted ? "#94a3b8" : "#4ade80",
            fontSize: 12,
            fontFamily: "monospace",
            fontWeight: 800,
            cursor: "pointer",
            backdropFilter: "blur(12px)",
            boxShadow: isMuted ? "0 4px 16px rgba(0,0,0,0.5)" : "0 0 16px rgba(34, 197, 94, 0.4)",
            transition: "all 0.2s ease",
          }}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          <span>{isMuted ? "Sound: Off" : "Sound: On"}</span>
        </button>
      </div>

      {/* Top Split-Flap Departure Board HUD */}
      <DepartureBoard
        currentStationIdx={currentStationIdx}
        isStopped={isStopped}
        speed={speed}
      />

      {/* Interactive Quick-Jump Deployed Project Bar (When stopped at Projects Junction) */}
      {currentStationIdx === 0 && isStopped && (
        <div
          style={{
            position: "absolute",
            top: 86,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 35,
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
            justifyContent: "center",
            pointerEvents: "auto",
            animation: "fadeIn 0.3s ease",
          }}
        >
          <span style={{ fontSize: 11, fontFamily: "monospace", color: "#fbbf24", background: "rgba(10,14,26,0.9)", padding: "4px 10px", borderRadius: 100, border: "1px solid rgba(251,191,36,0.3)" }}>
            ⚡ CLICK POSTER OR TAP TO VIEW LIVE:
          </span>
          {PROJECTS_DATA.slice(0, 3).map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProject(p)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: p.status === "Deployed" ? "rgba(34, 197, 94, 0.9)" : "rgba(36, 91, 255, 0.9)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                color: "#ffffff",
                padding: "4px 12px",
                borderRadius: 100,
                fontSize: 11.5,
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
              }}
            >
              <span>{p.title}</span>
              <ExternalLink size={11} />
            </button>
          ))}
        </div>
      )}

      {/* Interactive Quick-Jump Builder Dossier Bar (When stopped at About Town) */}
      {currentStationIdx === 2 && isStopped && (
        <div
          style={{
            position: "absolute",
            top: 86,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 35,
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
            justifyContent: "center",
            pointerEvents: "auto",
            animation: "fadeIn 0.3s ease",
          }}
        >
          <span style={{ fontSize: 11, fontFamily: "monospace", color: "#fbbf24", background: "rgba(10,14,26,0.9)", padding: "4px 10px", borderRadius: 100, border: "1px solid rgba(251,191,36,0.3)" }}>
            📍 BHARAT PATEL · TSEC MUMBAI · HACKATHON WINNER
          </span>
          <button
            onClick={() => setShowAboutModal(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              background: "linear-gradient(135deg, #d97706, #fbbf24)",
              border: "1px solid rgba(255, 255, 255, 0.4)",
              color: "#030712",
              padding: "4px 14px",
              borderRadius: 100,
              fontSize: 11.5,
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 2px 12px rgba(251,191,36,0.4)",
            }}
          >
            <span>Inspect Builder Dossier & Wins 📜</span>
          </button>
          <a
            href="/Bharat_Patel_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              background: "rgba(36, 91, 255, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "#ffffff",
              padding: "4px 12px",
              borderRadius: 100,
              fontSize: 11.5,
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
            }}
          >
            <span>Resume PDF</span>
            <ExternalLink size={11} />
          </a>
        </div>
      )}

      {/* Emergency Pull Chain Alert Modal */}
      {emergencyFact && (
        <EmergencyAlert fact={emergencyFact} onClose={handleCloseEmergency} />
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}

      {/* About Station Dossier Modal */}
      {showAboutModal && (
        <AboutStationModal onClose={() => setShowAboutModal(false)} />
      )}

      {/* Bottom Route Tracker Map & Audio / Skip Controls */}
      <RouteMap
        currentStationIdx={currentStationIdx}
        progress={progress}
        onSelectStation={handleSelectStation}
        isMuted={isMuted}
        onToggleAudio={handleToggleAudio}
        onSkipToTerminus={handleSkipToTerminus}
      />

      {/* Bottom-Right Passenger Instruction & Controls Guide */}
      <PassengerGuide />

      {/* Printable Passenger Ticket at Terminus */}
      {atTerminus && <TrainTicket />}

      {/* Station Boarding Loader on Initial View */}
      {!boarded && <DepartureLoader onEnter={handleBoard} />}
    </div>
  );
}
