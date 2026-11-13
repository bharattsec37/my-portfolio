"use client";

import React, { useState, useEffect } from "react";
import { Mail, MessageCircle, Copy, Check, X, ArrowUpRight, Phone } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const email = "bharatpatelk2005@gmail.com";
  const whatsappNumber = "8470930964";
  const formattedPhone = "+91 8470930964";
  const whatsappUrl = `https://wa.me/91${whatsappNumber}?text=${encodeURIComponent("Hi Bharat, I visited your portfolio and would like to connect!")}`;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const copyToClipboard = (text: string, type: "email" | "phone") => {
    navigator.clipboard.writeText(text);
    if (type === "email") {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(6, 8, 14, 0.8)",
        backdropFilter: "blur(16px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.2s ease-out",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 460,
          background: "linear-gradient(145deg, #101422 0%, #0d101d 100%)",
          border: "1px solid rgba(56, 189, 248, 0.3)",
          borderRadius: 20,
          padding: "28px 24px",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(36, 91, 255, 0.25)",
          position: "relative",
          color: "#FFFFFF",
          animation: "slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            color: "#94a3b8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#FFFFFF";
            e.currentTarget.style.background = "rgba(255,255,255,0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#94a3b8";
            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
          }}
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: 24, paddingRight: 32 }}>
          <div style={{ fontSize: 11, fontFamily: "monospace", letterSpacing: "0.1em", color: "#38bdf8", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>
            Direct Contact
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: "-0.02em", color: "#FFFFFF" }}>
            Get in touch with Bharat
          </h2>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>
            Open to internships, project collaborations, and engineering conversations. Reach out directly via Email or WhatsApp.
          </p>
        </div>

        {/* Contact Options List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Option 1: Email */}
          <div
            style={{
              padding: "16px 18px",
              borderRadius: 14,
              background: "rgba(36, 91, 255, 0.08)",
              border: "1px solid rgba(56, 189, 248, 0.25)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              transition: "border-color 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "rgba(36, 91, 255, 0.2)",
                    border: "1px solid rgba(56, 189, 248, 0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#38bdf8",
                  }}
                >
                  <Mail size={18} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontFamily: "monospace", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Email ID
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF", wordBreak: "break-all" }}>
                    {email}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions: Mailto & Copy */}
            <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
              <a
                href={`mailto:${email}`}
                style={{
                  flex: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "9px 14px",
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #245BFF 0%, #3b82f6 100%)",
                  color: "#FFFFFF",
                  fontSize: 12,
                  fontWeight: 600,
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(36, 91, 255, 0.35)",
                }}
              >
                <span>Send Email</span>
                <ArrowUpRight size={13} />
              </a>
              <button
                onClick={() => copyToClipboard(email, "email")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 14px",
                  borderRadius: 8,
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: copiedEmail ? "#4ade80" : "#cbd5e1",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {copiedEmail ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
                <span>{copiedEmail ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          </div>

          {/* Option 2: WhatsApp */}
          <div
            style={{
              padding: "16px 18px",
              borderRadius: 14,
              background: "rgba(34, 197, 94, 0.08)",
              border: "1px solid rgba(34, 197, 94, 0.25)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              transition: "border-color 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "rgba(34, 197, 94, 0.2)",
                    border: "1px solid rgba(34, 197, 94, 0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#4ade80",
                  }}
                >
                  <MessageCircle size={18} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontFamily: "monospace", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    WhatsApp
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF" }}>
                    {formattedPhone}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions: Open WhatsApp & Copy */}
            <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  flex: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "9px 14px",
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
                  color: "#FFFFFF",
                  fontSize: 12,
                  fontWeight: 600,
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(34, 197, 94, 0.35)",
                }}
              >
                <span>Chat on WhatsApp</span>
                <ArrowUpRight size={13} />
              </a>
              <button
                onClick={() => copyToClipboard(whatsappNumber, "phone")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 14px",
                  borderRadius: 8,
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: copiedPhone ? "#4ade80" : "#cbd5e1",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {copiedPhone ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
                <span>{copiedPhone ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div style={{ marginTop: 20, textAlign: "center", fontSize: 11, fontFamily: "monospace", color: "#64748b" }}>
          Located in Mumbai, India (UTC +5:30) · Usually replies within a few hours
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

export function ContactTrigger({
  className,
  children,
  onClick,
}: {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={(e) => {
          e.preventDefault();
          onClick?.();
          setModalOpen(true);
        }}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          font: "inherit",
          color: "inherit",
          textAlign: "inherit",
          cursor: "pointer",
        }}
      >
        {children}
      </button>
      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

