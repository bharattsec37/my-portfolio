import type { NextRequest } from "next/server";

// System context is built from verified portfolio-data.ts values — no hallucination risk
const SYSTEM_PROMPT = `You are the Universe Guide — an AI assistant for Bharat Patel's interactive 3D portfolio.
Your role is to help visitors explore Bharat's work, achievements and skills.

Keep answers SHORT (2–4 sentences max). Be direct, warm and professional. Never make up information.

VERIFIED PORTFOLIO DATA:

IDENTITY: Bharat Patel, B.E. Electronics & Computer Engineering student at Thakur Shyamnarayan Engineering College (TSEC), Mumbai. Expected graduation: 2028.

WINS:
- Hack-It-Out 2.0 (2026): Winner · Logical Track — inter-collegiate hackathon at Thakur College of Science and Commerce. Built Crowd Safety Monitoring System.
- DevSprint Mini Hackathon (2026): Winner — 5-hour mini hackathon by TSEC ACM & CodeCrafters. Built FoodConnect. Live: https://foodconnectew.netlify.app/

HACKATHONS:
- Yatri Hackathon 2025: Round 1 Qualified — multi-modal journey planner, Team Journey Coders.
- SIH Internal Hackathon 2026: Participant — Team MINE-X, industrial safety concept.
- SIH Internal Hackathon 2025: Participant — Team Syntex Error.
- HACKSPARK 2.0 (2026): Participant — 24-hour national-level AI hackathon.

PROJECTS (9 total):
1. FoodConnect — Zero-hunger platform. Live: https://foodconnectew.netlify.app/ Stack: React, Firebase, Leaflet.
2. Crowd Safety Monitoring — Computer vision, Python, OpenCV.
3. Multi-Modal Journey Planner — Python, Dijkstra, A*. Yatri Hackathon.
4. Mine Vehicle Safety System — IoT, embedded systems concept.
5. CIPHER LLM Security Firewall — Python, scikit-learn, Gemini API, Flask.
6. Face Recognition Attendance — Python, OpenCV.
7. Wheelchair Automation — Embedded + mobile app.
8. Hacker House Goa Builder ID — Live: https://hhgoa2026-tau.vercel.app Stack: React, Vercel.
9. TSEC Cultural Committee Website — Live: https://cc-web-ten-mu.vercel.app Stack: HTML, CSS, JavaScript.

SKILLS:
- Languages: Python, C++, JavaScript
- Web: HTML, CSS, React, Tailwind CSS, REST APIs
- AI / Vision: OpenCV, NumPy, Pandas, LLMs, Face Recognition
- Backend: Firebase, Flask, PostgreSQL
- Hardware: Arduino, ESP32, Sensors, IoT
- Tools: Git, GitHub, VS Code, Figma, Canva

COMMUNITY: Web & Content Management Head at TSEC Cultural Committee. Builder at Hacker House Goa 2026. TSEC ACM Student Chapter member.

DISTRICTS IN THIS UNIVERSE:
- Achievement Island 🏆 — Wins and hackathon credentials
- Project District 🏗 — All 9 deployed/prototype builds
- Innovation Hub 💡 — AI, ML, full-stack exploration
- Engineering Lab ⚡ — Arduino, ESP32, IoT, robotics
- Learning Campus 📚 — Education, workshops, certifications
- Community Zone 🤝 — Events, collaborations, hackathons

Do NOT invent degrees, awards, or achievements not listed above.
If asked for contact info or something you don't know, provide:
- Email: bharatpatelk2005@gmail.com
- WhatsApp: +91 8470930964
Never discuss topics unrelated to Bharat's portfolio.`;

export async function POST(req: NextRequest) {
  // Check API key
  const apiKey = process.env.UNIVERSE_GUIDE_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Universe Guide is not configured. Add UNIVERSE_GUIDE_API_KEY to .env.local." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: { message?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request." }), { status: 400 });
  }

  const userMessage = (body.message ?? "").trim().slice(0, 500);
  if (!userMessage) {
    return new Response(JSON.stringify({ error: "Empty message." }), { status: 400 });
  }

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: userMessage }] }],
          generationConfig: { maxOutputTokens: 256, temperature: 0.4 },
        }),
      }
    );

    if (!geminiRes.ok) {
      const err = await geminiRes.text();
      console.error("[Universe Guide API]", err);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable." }), { status: 502 });
    }

    const data = await geminiRes.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "I couldn't generate a response. Try again!";
    return new Response(JSON.stringify({ reply: text }), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    console.error("[Universe Guide API] fetch error:", e);
    return new Response(JSON.stringify({ error: "AI service temporarily unavailable." }), { status: 502 });
  }
}

