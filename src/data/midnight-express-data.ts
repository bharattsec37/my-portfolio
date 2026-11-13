export interface StationProject {
  id: string;
  title: string;
  category: string;
  status: "Deployed" | "Prototype" | "Winner";
  year: string;
  description: string;
  technologies: string[];
  liveLink?: string;
  githubLink?: string;
}

export interface StationSkillCrate {
  category: string;
  color: string;
  crateSize: [number, number, number];
  skills: string[];
}

export interface StationData {
  id: string;
  name: string;
  code: string;
  subtitle: string;
  distanceKm: number;
}

export const STATIONS: StationData[] = [
  {
    id: "projects",
    name: "Projects Junction",
    code: "PRJ-01",
    subtitle: "Deployed Web Apps, AI Vision & Connected Systems",
    distanceKm: 14,
  },
  {
    id: "skills",
    name: "Skills Central",
    code: "SKL-02",
    subtitle: "Cargo Manifest: Frameworks, Microcontrollers & AI Models",
    distanceKm: 28,
  },
  {
    id: "about",
    name: "About Town",
    code: "ABT-03",
    subtitle: "The Builder's Outpost: Mumbai · TSEC · Electronics & Computer Eng.",
    distanceKm: 42,
  },
  {
    id: "terminus",
    name: "Terminus: Contact",
    code: "TRM-04",
    subtitle: "Final Destination: Tickets, Passports & Immediate Collaboration",
    distanceKm: 56,
  },
];

export const PROJECTS_DATA: StationProject[] = [
  {
    id: "foodconnect",
    title: "FoodConnect",
    category: "Full-Stack · Social Impact",
    status: "Deployed",
    year: "2026",
    description: "Zero-hunger food redistribution platform connecting restaurants, donors and NGOs. Won DevSprint Mini Hackathon.",
    technologies: ["React", "Firebase", "Leaflet", "Tailwind CSS"],
    liveLink: "https://foodconnectew.netlify.app/",
    githubLink: "https://github.com/bharatsec37",
  },
  {
    id: "hacker-house",
    title: "Hacker House Goa · ID",
    category: "Community · Web App",
    status: "Deployed",
    year: "2026",
    description: "Builder identity and crew-frame generator web app created for Hacker House Goa 2026. Live on Vercel.",
    technologies: ["React", "Vercel", "Tailwind CSS", "UI/UX"],
    liveLink: "https://hhgoa2026-tau.vercel.app",
    githubLink: "https://github.com/bharatsec37",
  },
  {
    id: "cultural-committee",
    title: "TSEC Cultural Committee",
    category: "Web & Content Head",
    status: "Deployed",
    year: "2026",
    description: "Official event and stories website for the TSEC Cultural Committee, deployed on Vercel.",
    technologies: ["HTML5", "CSS3", "JavaScript", "Vercel"],
    liveLink: "https://cc-web-ten-mu.vercel.app",
    githubLink: "https://github.com/bharatsec37",
  },
  {
    id: "crowd-safety",
    title: "Crowd Safety Monitoring",
    category: "AI · Computer Vision",
    status: "Winner",
    year: "2026",
    description: "YOLOv8 & OpenCV computer vision pipeline detecting crowd density anomalies. Won Hack-It-Out 2.0 Logical Track.",
    technologies: ["Python", "YOLOv8", "OpenCV", "Flask"],
    githubLink: "https://github.com/bharatsec37",
  },
  {
    id: "journey-planner",
    title: "Multi-Modal Journey Planner",
    category: "Algorithms & Transit",
    status: "Prototype",
    year: "2025",
    description: "Intermodal route engine using Dijkstra and A* across Mumbai local trains, metro lines, and buses. Yatri Hackathon Round 1 Qualified.",
    technologies: ["Python", "REST APIs", "Dijkstra", "A*"],
    githubLink: "https://github.com/bharatsec37",
  },
  {
    id: "mine-safety",
    title: "Mine Vehicle Safety System",
    category: "Embedded & IoT",
    status: "Prototype",
    year: "2026",
    description: "Dynamic safety bubble using ESP32, ultrasonic/tilt sensors, and CAN bus relay. SIH 2026 Team MINE-X concept.",
    technologies: ["ESP32", "C++", "Sensors", "Edge IoT"],
    githubLink: "https://github.com/bharatsec37",
  },
];

export const SKILLS_CRATES: StationSkillCrate[] = [
  {
    category: "AI & VISION",
    color: "#a855f7",
    crateSize: [1.8, 1.2, 1.2],
    skills: ["Python", "PyTorch", "OpenCV", "YOLOv8", "LLMs & RAG", "Face Recognition"],
  },
  {
    category: "FULL-STACK WEB",
    color: "#38bdf8",
    crateSize: [2.0, 1.4, 1.3],
    skills: ["Next.js", "React 19", "TypeScript", "Node.js", "Tailwind CSS", "PostgreSQL"],
  },
  {
    category: "HARDWARE & IOT",
    color: "#2dd4bf",
    crateSize: [1.7, 1.1, 1.1],
    skills: ["ESP32", "Arduino", "C / C++", "MicroPython", "Sensors & Actuators", "MQTT"],
  },
  {
    category: "TOOLS & DEPLOYMENT",
    color: "#fb923c",
    crateSize: [1.6, 1.0, 1.0],
    skills: ["Linux", "Git & GitHub", "Docker", "Vercel / Netlify", "Supabase", "Figma"],
  },
];

export const ABOUT_STATION = {
  name: "Bharat Patel",
  location: "Mumbai, Maharashtra, India",
  tagline: "Curiosity, with a circuit.",
  education: {
    degree: "B.E. in Electronics & Computer Engineering",
    college: "Thakur Shyamnarayan Engineering College (TSEC), Mumbai",
    batch: "Expected 2028 (Third Year)",
    prior: "Diploma in Computer Applications (Grade A · 84%)",
  },
  roles: [
    "Web & Content Management Head — TSEC Cultural Committee",
    "Team Builder & Participant — Hacker House Goa 2026",
    "Hackathon Competitor & Prototype Specialist",
  ],
  bio: "I'm an Electronics & Computer Engineering student who loves building at the intersection of AI models, full-stack software, and physical embedded hardware. I thrive in hackathons, turning rough sketches into deployed prototypes within 24 hours.",
  motto: "Learn by Building. Compete by Innovating. Grow by Solving Problems.",
  achievements: [
    "🏆 Winner · Logical Track — Hack-It-Out 2.0 (TCSC)",
    "🏆 Winner — DevSprint Mini Hackathon (FoodConnect)",
    "🥉 3rd Place — Mystery Event · Tech Hunt (TSEC)",
    "⭐ Qualified Round 1 — Yatri Hackathon 2025 (Journey Coders)",
    "📜 Certified — Robotics & Automation Workshop (TSEC 2025)",
    "🚀 Participant — Smart India Hackathon (SIH 2025 & 2026)",
    "⚡ Participant — HACKSPARK 2.0 (24h National AI Hackathon)",
  ],
};

export const CONTACT_TICKET = {
  ticketNumber: "EXP-2026-BP-001",
  passenger: "BHARAT PATEL",
  classType: "FIRST CLASS SLEEPER",
  origin: "MUMBAI CENTRAL (BCT)",
  destination: "WORLDWIDE / REMOTE",
  date: "OCTOBER 2026",
  validity: "LIFETIME PASS",
  stubs: [
    {
      label: "EMAIL",
      value: "bharatpatelk2005@gmail.com",
      action: "mailto:bharatpatelk2005@gmail.com",
      display: "bharatpatelk2005@gmail.com",
      color: "#38bdf8",
    },
    {
      label: "WHATSAPP",
      value: "+91 8470930964",
      action: "https://wa.me/918470930964",
      display: "+91 8470930964",
      color: "#22c55e",
    },
    {
      label: "LINKEDIN",
      value: "linkedin.com/in/bharat-patel-3aa703992",
      action: "https://www.linkedin.com/in/bharat-patel-3aa703992",
      display: "in/bharat-patel",
      color: "#60a5fa",
    },
    {
      label: "GITHUB",
      value: "github.com/bharatsec37",
      action: "https://github.com/bharatsec37",
      display: "github/bharatsec37",
      color: "#e2e8f0",
    },
  ],
};

export const EASTER_EGG_FACTS = [
  "Bharat once soldered an ESP32 circuit board at 3:00 AM during a 24-hour hackathon, and it won 1st place the next morning!",
  "Bharat serves as Web & Content Management Head for the TSEC Cultural Committee, leading student web builds and stories.",
  "FoodConnect was built in a rapid 5-hour hackathon sprint at DevSprint and took home 1st Place Winner!",
  "The chai in this carriage was brewed with fresh ginger and cardamom. Train rules: Always learn by building!",
  "Bharat is actively open to internships, thoughtful collaborations, and ambitious prototype builds worldwide.",
];
