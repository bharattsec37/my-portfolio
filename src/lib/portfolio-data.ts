export type ProjectRecord = {
  id: string; name: string; category: string; status: string; statusNote: string; year: string;
  description: string; problem: string; approach: string; role: string; technologies: string[];
  link?: string; glyph: string; field: string;
};

export type AchievementRecord = {
  id: string; name: string; recognition: string; organization: string; year: string; description: string;
  category: "Wins" | "Hackathons" | "Technical Activities" | "Workshops" | "Certifications" | "Participation";
  file?: string; fileType?: "image" | "pdf"; published: boolean; featured?: boolean;
  link?: string; linkText?: string;
};

export type AchievementMedia = {
  file: string;
  label: string;
  kind: "Certificate" | "Event photo" | "Project photo";
  fileType: "image" | "pdf";
};

export const projects: ProjectRecord[] = [
  { id: "foodconnect", name: "FoodConnect", category: "SOCIAL IMPACT / FULL-STACK", status: "Prototype", statusNote: "Working prototype with a live demo.", year: "2026", description: "A zero-hunger platform connecting food donors, restaurants and NGOs to reduce food waste and improve distribution.", problem: "Usable surplus food and local demand often fail to meet at the right time and place.", approach: "Multi-role donation management, NGO hubs, a GPS-integrated impact map, partner rewards and a last-mile delivery workflow.", role: "Built with a hackathon team; winner at DevSprint Mini Hackathon.", technologies: ["React", "Firebase", "Leaflet", "Full-stack"], link: "https://foodconnectew.netlify.app/", glyph: "01", field: "DONOR ↔ NGO ↔ COMMUNITY" },
  { id: "crowd-safety", name: "Crowd Safety Monitoring", category: "AI / COMPUTER VISION", status: "Prototype", statusNote: "Prototype designed under hackathon time constraints.", year: "2026", description: "A computer-vision concept to identify potentially unsafe crowd conditions and support faster situational awareness.", problem: "Crowd density and changing conditions are difficult to assess consistently in busy spaces.", approach: "A prototype monitoring workflow designed to surface crowd conditions for human review.", role: "Designed and built as a hackathon prototype; winner of the Hack-It-Out 2.0 Logical Track.", technologies: ["Python", "OpenCV", "Computer Vision"], glyph: "02", field: "SENSE → FLAG → REVIEW" },
  { id: "yatri-planner", name: "Multi-Modal Journey Planner", category: "TRANSPORT TECHNOLOGY", status: "Prototype", statusNote: "Round 1-qualified concept; no Round 2 claim is made here.", year: "2025", description: "A public-transport journey planner combining route options, fare estimates and alert-ready trip information.", problem: "Planning a journey across bus, metro and train modes can mean comparing disconnected information.", approach: "Backend APIs and route-planning logic using Dijkstra and A* across multiple transport modes.", role: "Built as part of Team Journey Coders; qualified for Round 1 of Yatri Hackathon 2025.", technologies: ["Python", "REST APIs", "Dijkstra", "A*"], glyph: "03", field: "BUS + METRO + RAIL" },
  { id: "mine-safety", name: "Mine Vehicle Safety System", category: "INDUSTRIAL SAFETY / IoT", status: "Idea", statusNote: "Proposed solution and architecture; not presented as a completed system.", year: "2026", description: "A proposed vehicle-safety system for mining environments where fog and low visibility increase risk.", problem: "Fixed separation distances do not reflect changing visibility, speed or sensor confidence.", approach: "A Dynamic Digital Safety Bubble that adjusts intended safe distance using operating conditions and hazard signals.", role: "Team MINE-X concept for the SIH Internal Hackathon 2026.", technologies: ["IoT", "Sensors", "Edge Processing", "Safety Systems"], glyph: "04", field: "VISIBILITY ↔ SAFE DISTANCE" },
  { id: "cipher-firewall", name: "CIPHER · LLM Security Firewall", category: "AI SECURITY / PYTHON", status: "Prototype", statusNote: "Resume-described prototype; implementation details remain editable.", year: "2026", description: "An inline prompt-screening concept designed to flag injection attempts before they reach a language model.", problem: "Prompt injection and jailbreak attempts can undermine the intended boundaries of LLM applications.", approach: "A layered pipeline combining rules, an ML classifier and Gemini analysis, with a scoring and session-tracking dashboard.", role: "Built a Python prototype integrating model analysis and a browser-facing dashboard.", technologies: ["Python", "scikit-learn", "Gemini API", "Flask"], glyph: "05", field: "INPUT → SCREEN → MODEL" },
  { id: "face-attendance", name: "Face Recognition Attendance", category: "COMPUTER VISION / PYTHON", status: "Prototype", statusNote: "Webcam-based prototype with an HTML/CSS dashboard.", year: "2026", description: "A webcam-based attendance prototype that detects and recognizes faces, then records attendance in a dashboard.", problem: "Manual attendance is repetitive and can make record keeping harder to review.", approach: "A webcam capture flow with face recognition and an attendance-record dashboard.", role: "Developed the prototype and its dashboard.", technologies: ["Python", "OpenCV", "HTML", "CSS"], glyph: "06", field: "CAMERA → MATCH → RECORD" },
  { id: "wheelchair-automation", name: "Wheelchair Automation", category: "EMBEDDED SYSTEMS / IoT", status: "Prototype", statusNote: "Prototype described in the supplied project brief.", year: "", description: "An intelligent wheelchair prototype combining embedded hardware with a companion mobile application.", problem: "The project explores how hardware control and a mobile interface can work together in an assistive device.", approach: "An embedded control concept paired with mobile application integration.", role: "Project details and implementation scope can be updated from the portfolio content model.", technologies: ["Embedded Systems", "Mobile App", "IoT"], glyph: "07", field: "CONTROL ↔ ASSIST" },
  { id: "hacker-house", name: "Hacker House Goa · Builder ID", category: "COMMUNITY / WEB APP", status: "Deployed", statusNote: "Working builder identity app deployed on Vercel.", year: "2026", description: "A builder identity and crew-frame web app created for Hacker House Goa 2026.", problem: "A shared event needs a simple way to create, personalize and share participant identity.", approach: "A web app for building a branded ID, selecting themes, previewing the result and sharing it.", role: "Built the web app and event branding for Hacker House Goa 2026.", technologies: ["Web App", "React", "Vercel"], glyph: "08", field: "MAKE / PERSONALIZE / SHARE", link: "https://hhgoa2026-tau.vercel.app" },
  { id: "cultural-committee", name: "TSEC Cultural Committee Website", category: "WEB / COMMUNITY", status: "Deployed", statusNote: "Prototype website deployed on Vercel.", year: "2026", description: "A prototype website for the TSEC Cultural Committee, created alongside web and content responsibilities.", problem: "Student events need a clear, branded place to share information and updates.", approach: "A committee website prototype with event branding and content pages.", role: "Designed and built as Web & Content Management Head of the Cultural Committee.", technologies: ["HTML", "CSS", "JavaScript", "Vercel"], glyph: "09", field: "EVENTS / PEOPLE / STORIES", link: "https://cc-web-ten-mu.vercel.app" },
];

export const skillGroups = [
  { name: "Languages", skills: ["Python", "C++", "JavaScript"] },
  { name: "Web", skills: ["HTML", "CSS", "React", "Tailwind CSS", "REST APIs"] },
  { name: "AI / Vision", skills: ["OpenCV", "NumPy", "Pandas", "LLMs", "Face Recognition"] },
  { name: "Backend / Data", skills: ["Firebase", "Flask", "PostgreSQL"] },
  { name: "Hardware", skills: ["Arduino", "ESP32", "Sensors", "IoT"] },
  { name: "Tools", skills: ["Git", "GitHub", "VS Code", "Figma", "Canva"] },
];

export const achievements: AchievementRecord[] = [
  {
    id: "hack-it-out-2026",
    name: "Hack-It-Out 2.0",
    recognition: "Winner · Logical Track",
    organization: "Department of Computer Science, Thakur College of Science and Commerce",
    year: "January 2026",
    description: "Secured the Winner's position in the Logical Track at Hack-It-Out 2.0, an inter-collegiate hackathon organized by Thakur College of Science and Commerce. Demonstrated algorithmic problem-solving skills and technical ingenuity.",
    category: "Wins",
    file: "/certificates/hack-it-out-winner.webp",
    fileType: "image",
    published: true,
    featured: true,
  },
  {
    id: "devsprint-2026",
    name: "DevSprint Mini Hackathon",
    recognition: "Winner",
    organization: "TSEC ACM Student Chapter in collaboration with CodeCrafters",
    year: "March 2026",
    description: "Won DevSprint, a 5-hour mini hackathon organized by TSEC ACM Student Chapter in collaboration with CodeCrafters. Collaborated on developing FoodConnect, a technology-driven solution addressing food wastage and hunger.",
    category: "Wins",
    file: "/certificates/devsprint-winner.webp",
    fileType: "image",
    published: true,
    featured: true,
    link: "https://foodconnectew.netlify.app/",
    linkText: "Visit FoodConnect live demo",
  },
  {
    id: "tech-hunt-2026",
    name: "Mystery Event · Tech Hunt",
    recognition: "Third Place",
    organization: "Thakur Shyamnarayan Engineering College",
    year: "January 2026",
    description: "Secured third place in the Tech Hunt competition during TSEC's technical event. Demonstrated technical awareness, logical thinking and problem-solving abilities through competitive challenges.",
    category: "Wins",
    file: "/certificates/tech-hunt-participant.webp",
    fileType: "image",
    published: true,
    featured: true,
  },
  {
    id: "yatri-2025",
    name: "Yatri Hackathon 2025",
    recognition: "Round 1 Qualified",
    organization: "DataAstraa in collaboration with Yatri · Team Journey Coders",
    year: "September 2025",
    description: "Successfully qualified for Round 1 of Yatri Hackathon 2025 as part of Team Journey Coders. Worked on a multi-modal journey planning concept focused on simplifying public transportation and improving travel experiences.",
    category: "Hackathons",
    file: "/certificates/yatri-round1-certificate.webp",
    fileType: "image",
    published: true,
    featured: true,
  },
  {
    id: "sih-2026",
    name: "SIH Internal Hackathon 2026",
    recognition: "Participant · Team MINE-X",
    organization: "AICTE Smart India Hackathon Selection",
    year: "August 2026",
    description: "Participated in the AICTE Smart India Hackathon 2026 Internal Hackathon as a member of Team MINE-X. Explored technology-driven solutions addressing industrial challenges through innovation and collaborative problem-solving.",
    category: "Hackathons",
    file: "/certificates/sih-2026-certificate.webp",
    fileType: "image",
    published: true,
  },
  {
    id: "sih-2025",
    name: "Internal Hackathon 2025",
    recognition: "Participant · Team Syntex Error",
    organization: "Smart India Hackathon Internal Hackathon",
    year: "September 2025",
    description: "Participated in the Smart India Hackathon 2025 Internal Hackathon as a member of Team Syntex Error. Gained practical experience in collaborative innovation, idea development and presenting technology-based solutions.",
    category: "Hackathons",
    file: "/certificates/sih-2025-certificate-1.webp",
    fileType: "image",
    published: true,
  },
  {
    id: "hackspark-2026",
    name: "HACKSPARK 2.0",
    recognition: "Participant",
    organization: "TSEC · 24-hour National-Level AI Hackathon",
    year: "February 2026",
    description: "Participated in HACKSPARK 2.0, a 24-hour national-level AI-focused hackathon organized at TSEC. Experienced an intensive innovation environment involving teamwork, technical exploration and problem-solving.",
    category: "Hackathons",
    file: "/certificates/hackspark-participation.webp",
    fileType: "image",
    published: true,
  },
  {
    id: "brand-storming-2026",
    name: "Brand Storming",
    recognition: "Participant",
    organization: "Thakur Shyamnarayan Engineering College",
    year: "January 2026",
    description: "Participated in Brand Storming, a competition organized at Thakur Shyamnarayan Engineering College. Explored creative thinking, brand positioning and strategic approaches to presenting ideas.",
    category: "Technical Activities",
    file: "/certificates/brand-storming.webp",
    fileType: "image",
    published: true,
  },
  {
    id: "innovritti-2025",
    name: "INNOVRITTI 2025",
    recognition: "Participant",
    organization: "TSEC · Intra-College Pitching Competition",
    year: "August 2025",
    description: "Participated in TSEC's first intra-college pitching competition focused on entrepreneurship and innovation. Gained exposure to idea presentation, business thinking and communicating innovative concepts.",
    category: "Technical Activities",
    file: "/certificates/innovritti.webp",
    fileType: "image",
    published: true,
  },
  {
    id: "model-making-2025",
    name: "SYNAPSE 2025 · Model Making",
    recognition: "Participant",
    organization: "ISTE Student Chapter, TSEC",
    year: "September 2025",
    description: "Participated in the Model Making competition organized under SYNAPSE 2025 by the ISTE Student Chapter. Explored practical engineering concepts through model development and technical creativity.",
    category: "Technical Activities",
    file: "/certificates/model-making.webp",
    fileType: "image",
    published: true,
  },
  {
    id: "robotics-workshop-2025",
    name: "Robotics and Automation",
    recognition: "Workshop Completion",
    organization: "Robotics and Automation Club, TSEC",
    year: "July 2025",
    description: "Successfully completed a workshop on Arduino, ESP32 and Sensor Interfacing organized by the Robotics and Automation Club at TSEC. Gained practical exposure to embedded systems, microcontrollers and sensor integration.",
    category: "Workshops",
    file: "/certificates/robotics-workshop-certificate.webp",
    fileType: "image",
    published: true,
  },
  {
    id: "vortex-2025",
    name: "Technical Paper Presentation · VORTEX 2025",
    recognition: "Participant",
    organization: "ISTE Student Chapter · State-Level Technical Event",
    year: "February 2025",
    description: "Participated in the Technical Paper Presentation competition at VORTEX 2025, a state-level technical event organized by the ISTE Student Chapter. Explored technical research, structured presentation and communication of engineering concepts.",
    category: "Technical Activities",
    file: "/certificates/vortex-paper-presentation.webp",
    fileType: "image",
    published: true,
  },
  {
    id: "tech-traitors-2025",
    name: "Tech Traitors",
    recognition: "Participant",
    organization: "Thakur Shyamnarayan Engineering College",
    year: "July 2025",
    description: "Participated in Tech Traitors, a technical event organized at Thakur Shyamnarayan Engineering College. Engaged in technology-oriented challenges and developed problem-solving and analytical thinking skills.",
    category: "Technical Activities",
    file: "/certificates/tech-traitors.webp",
    fileType: "image",
    published: true,
  },
  {
    id: "dca-2022",
    name: "Diploma in Computer Applications (DCA)",
    recognition: "Grade A · 84%",
    organization: "Tanishq Computer Classes",
    year: "2021–2022",
    description: "Successfully completed the Diploma in Computer Applications from Tanishq Computer Classes with Grade A and 84% marks. Covered computer fundamentals, DOS, Windows, MS Office, Tally and Internet applications.",
    category: "Certifications",
    file: "/certificates/diploma-computer-applications.webp",
    fileType: "image",
    published: true,
  },
];

export const achievementMediaById: Record<string, AchievementMedia[]> = {
  "devsprint-2026": [
    { file: "/certificates/devsprint-winner.webp", label: "Winner certificate", kind: "Certificate", fileType: "image" },
    { file: "/certificates/devsprint-team-photo.webp", label: "Team photo with certificate", kind: "Event photo", fileType: "image" },
    { file: "/certificates/devsprint-event-photo.webp", label: "Hackathon room", kind: "Event photo", fileType: "image" },
  ],
  "hack-it-out-2026": [
    { file: "/certificates/hack-it-out-winner.webp", label: "Winner certificate · Logical Track", kind: "Certificate", fileType: "image" },
    { file: "/certificates/hack-it-out-team-photo.webp", label: "Team recognition photo", kind: "Event photo", fileType: "image" },
    { file: "/certificates/hack-it-out-event-photo.webp", label: "Hack-It-Out team photo with trophies", kind: "Event photo", fileType: "image" },
  ],
  "robotics-workshop-2025": [
    { file: "/certificates/robotics-workshop-certificate.webp", label: "Workshop completion certificate", kind: "Certificate", fileType: "image" },
    { file: "/certificates/robotics-prototype-photo.webp", label: "Robot prototype", kind: "Project photo", fileType: "image" },
    { file: "/certificates/robotics-workshop-group.webp", label: "Workshop group photo", kind: "Event photo", fileType: "image" },
  ],
  "sih-2025": [
    { file: "/certificates/sih-2025-certificate-1.webp", label: "Participation certificate · Team Syntex Error", kind: "Certificate", fileType: "image" },
  ],
  "yatri-2025": [
    { file: "/certificates/yatri-round1-certificate.webp", label: "Round 1 qualification certificate", kind: "Certificate", fileType: "image" },
    { file: "/certificates/yatri-collaboration-screenshot.webp", label: "Journey Coders collaboration screenshot", kind: "Project photo", fileType: "image" },
    { file: "/certificates/yatri.pdf", label: "Original qualification PDF", kind: "Certificate", fileType: "pdf" },
  ],
  "vortex-2025": [{ file: "/certificates/vortex-paper-presentation.webp", label: "Participation certificate", kind: "Certificate", fileType: "image" }],
  "tech-traitors-2025": [{ file: "/certificates/tech-traitors.webp", label: "Participation certificate", kind: "Certificate", fileType: "image" }],
  "sih-2026": [{ file: "/certificates/sih-2026-certificate.webp", label: "Participation certificate · Team MINE-X", kind: "Certificate", fileType: "image" }],
  "hackspark-2026": [{ file: "/certificates/hackspark-participation.webp", label: "HACKSPARK 2.0 participation certificate", kind: "Certificate", fileType: "image" }],
  "model-making-2025": [{ file: "/certificates/model-making.webp", label: "Participation certificate", kind: "Certificate", fileType: "image" }],
  "tech-hunt-2026": [{ file: "/certificates/tech-hunt-participant.webp", label: "Third Place certificate", kind: "Certificate", fileType: "image" }],
  "innovritti-2025": [{ file: "/certificates/innovritti.webp", label: "Participation certificate", kind: "Certificate", fileType: "image" }],
  "innovriti-2025": [{ file: "/certificates/innovritti.webp", label: "Participation certificate", kind: "Certificate", fileType: "image" }],
  "dca-2022": [{ file: "/certificates/diploma-computer-applications.webp", label: "Grade A · 84% certificate", kind: "Certificate", fileType: "image" }],
  "brand-storming-2026": [{ file: "/certificates/brand-storming.webp", label: "Participation certificate", kind: "Certificate", fileType: "image" }],
};