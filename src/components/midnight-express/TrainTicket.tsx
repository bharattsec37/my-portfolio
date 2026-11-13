"use client";

import React, { useState } from "react";
import { ArrowUpRight, Check, Copy, Mail, MessageCircle, AtSign, Code2, Ticket } from "lucide-react";
import { CONTACT_TICKET } from "@/data/midnight-express-data";

export default function TrainTicket() {
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  const handleCopy = (val: string, label: string) => {
    navigator.clipboard.writeText(val);
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 2500);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "min(92%, 620px)",
        zIndex: 40,
        pointerEvents: "auto",
        animation: "ticketFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #fefce8 0%, #fef3c7 60%, #fae8ff 100%)",
          color: "#0f172a",
          borderRadius: 18,
          border: "2px dashed #b45309",
          padding: "24px 28px",
          maxHeight: "84vh",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(251, 191, 36, 0.3)",
          position: "relative",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Ticket Header & Watermark */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            borderBottom: "1.5px solid #d97706",
            paddingBottom: 14,
            marginBottom: 16,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Ticket size={20} color="#b45309" />
              <span style={{ fontSize: 13, fontFamily: "monospace", fontWeight: 900, color: "#92400e", letterSpacing: "0.1em" }}>
                THE MIDNIGHT EXPRESS · FIRST CLASS PASS
              </span>
            </div>
            <h3 style={{ fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 900, color: "#451a03", marginTop: 4, letterSpacing: "-0.02em" }}>
              Terminus Pass · Connect with Bharat
            </h3>
          </div>

          <div style={{ textAlign: "right", fontFamily: "monospace" }}>
            <span style={{ fontSize: 11, fontWeight: 800, background: "#f59e0b", color: "#451a03", padding: "3px 8px", borderRadius: 4 }}>
              {CONTACT_TICKET.ticketNumber}
            </span>
            <div style={{ fontSize: 10, color: "#78350f", marginTop: 4 }}>VALID WORLDWIDE</div>
          </div>
        </div>

        {/* Passenger Information Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: 12,
            marginBottom: 20,
            fontSize: 12,
            fontFamily: "monospace",
          }}
        >
          <div>
            <div style={{ color: "#78350f", fontSize: 10 }}>PASSENGER</div>
            <div style={{ fontWeight: 800, color: "#0f172a" }}>{CONTACT_TICKET.passenger}</div>
          </div>
          <div>
            <div style={{ color: "#78350f", fontSize: 10 }}>ORIGIN</div>
            <div style={{ fontWeight: 800, color: "#0f172a" }}>MUMBAI, INDIA</div>
          </div>
          <div>
            <div style={{ color: "#78350f", fontSize: 10 }}>DESTINATION</div>
            <div style={{ fontWeight: 800, color: "#0f172a" }}>NEW PROJECTS & TEAMS</div>
          </div>
          <div>
            <div style={{ color: "#78350f", fontSize: 10 }}>STATUS</div>
            <div style={{ fontWeight: 800, color: "#15803d" }}>OPEN TO WORK 🟢</div>
          </div>
        </div>

        {/* Tear-Off Stubs (Clickable Contact Actions) */}
        <div>
          <div style={{ fontSize: 11, fontFamily: "monospace", fontWeight: 800, color: "#92400e", marginBottom: 10, letterSpacing: "0.05em" }}>
            TEAR-OFF CONTACT STUBS (SELECT TO CONNECT OR COPY)
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 10,
            }}
          >
            {CONTACT_TICKET.stubs.map((stub) => {
              const isCopied = copiedLabel === stub.label;
              return (
                <div
                  key={stub.label}
                  style={{
                    background: "#ffffff",
                    border: "1.5px solid #d97706",
                    borderRadius: 10,
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden" }}>
                    {stub.label === "EMAIL" && <Mail size={16} color="#0284c7" />}
                    {stub.label === "WHATSAPP" && <MessageCircle size={16} color="#16a34a" />}
                    {stub.label === "LINKEDIN" && <AtSign size={16} color="#2563eb" />}
                    {stub.label === "GITHUB" && <Code2 size={16} color="#334155" />}

                    <div style={{ overflow: "hidden" }}>
                      <div style={{ fontSize: 9.5, fontFamily: "monospace", fontWeight: 800, color: "#78350f" }}>
                        {stub.label}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#0f172a",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {stub.display}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    <a
                      href={stub.action}
                      target={stub.label === "EMAIL" ? undefined : "_blank"}
                      rel="noreferrer"
                      style={{
                        padding: "5px 10px",
                        background: "#0f172a",
                        color: "#ffffff",
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <span>Open</span>
                      <ArrowUpRight size={12} />
                    </a>

                    <button
                      onClick={() => handleCopy(stub.value, stub.label)}
                      title="Copy to clipboard"
                      style={{
                        padding: "5px 8px",
                        background: isCopied ? "#16a34a" : "#f1f5f9",
                        color: isCopied ? "#ffffff" : "#475569",
                        border: "1px solid #cbd5e1",
                        borderRadius: 6,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                    >
                      {isCopied ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Note */}
        <div style={{ textAlign: "center", marginTop: 18, fontSize: 11, fontFamily: "monospace", color: "#78350f" }}>
          ★ PUNCHED AT THE TERMINUS · READY FOR IMMEDIATE INTERNSHIP & COLLABORATION ★
        </div>
      </div>
    </div>
  );
}
