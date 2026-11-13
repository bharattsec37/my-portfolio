import Image from "next/image";
import { ArrowDown, ArrowUpRight, AtSign, Compass, Link2, Mail, MapPin, MessageCircle, MoveUpRight } from "lucide-react";
import { achievements, projects, skillGroups } from "@/lib/portfolio-data";
import { CertificateGallery, MobileNav } from "@/components/portfolio-interactions";
import HeroOrb from "@/components/hero-orb";
import MidnightExpress from "@/components/midnight-express/MidnightExpress";
import { ContactTrigger } from "@/components/ContactModal";

const navigation = [
  { label: "About", target: "about" },
  { label: "Work", target: "work" },
  { label: "Recognition", target: "recognition" },
  { label: "Midnight Express 🚂", target: "midnight-express" },
  { label: "Contact", target: "contact" },
];

export default function Home() {
  return (
    <>
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Bharat Patel, home"><Image className="wordmark-logo" src="/icon.svg" alt="" width={52} height={52} priority /><span>BUILD LOG <i>/ 2026</i></span></a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item, index) => (
            <a
              href={`#${item.target}`}
              key={item.target}
              style={item.target === "midnight-express" ? { color: "#fbbf24", fontWeight: 700 } : undefined}
            >
              <span>0{index + 1}</span>{item.label}
            </a>
          ))}
        </nav>
        <ContactTrigger className="header-contact">
          Let&apos;s talk <ArrowUpRight size={15} />
        </ContactTrigger>
        <MobileNav items={navigation} />
      </header>
      <main>
        <section className="section about-section about-hero" id="about">
          <div className="section-heading about-heading"><div><p className="eyebrow section-kicker">01 / THE BUILDER</p><h2>Curiosity,<br /><em>with a circuit.</em></h2></div><p className="section-aside">A student of systems, from the code running on a screen to the sensors sensing the room around it.</p></div>
          <div className="about-layout"><div className="portrait-frame"><Image src="/images/bharat-patel.webp" alt="Portrait of Bharat Patel" fill sizes="(max-width: 760px) 90vw, 36vw" /><span className="portrait-label">BHARAT PATEL / MUMBAI</span></div>
            <div className="about-copy"><p className="about-lede">I like working where a rough idea can be tested against the real world.</p><p>I&apos;m a third-year Electronics and Computer Engineering student at Thakur Shyamnarayan Engineering College. My interests span AI, full-stack development, computer vision, embedded systems and IoT. Hackathons have become a place to learn quickly, collaborate closely and turn concepts into working prototypes.</p><blockquote>“Learn by Building. Compete by Innovating. Grow by Solving Problems.”</blockquote>
              <div className="education-row"><span>EDUCATION</span><div><strong>B.E. · Electronics & Computer Engineering</strong><small>Thakur Shyamnarayan Engineering College, Mumbai · Expected 2028</small></div></div>
              <div className="about-actions">
                <a className="button button-dark" href="/bharat-patel-resume.pdf" target="_blank" rel="noreferrer">Download resume <ArrowUpRight size={15} /></a>
                <ContactTrigger className="text-link">
                  Get in touch <ArrowUpRight size={15} />
                </ContactTrigger>
              </div>
            </div>
          </div>
        </section>

        <section className="hero" id="home">
          <div className="hero-grid-mark" aria-hidden="true" />
          <div className="hero-content">
            <p className="eyebrow"><span className="live-dot" /> OPEN TO INTERNSHIP & COLLABORATION</p>
            <h1>Ideas are<br />only the <em>start.</em></h1>
            <div className="hero-bottomline">
              <p className="hero-intro">I&apos;m Bharat Patel, an Electronics & Computer Engineering student building practical software, AI and connected systems.</p>
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginTop: 8 }}>
                <a className="text-link light-link" href="#work">Explore the work <ArrowDown size={16} /></a>
                <a href="#midnight-express" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)", color: "#FFFFFF", border: "1px solid rgba(251,191,36,0.35)", borderRadius: 100, padding: "8px 18px", fontSize: 12, fontWeight: 700, textDecoration: "none", boxShadow: "0 0 20px rgba(217,119,6,0.4)" }}>
                  Board Midnight Express 🚂
                </a>
              </div>
            </div>
            <div className="hero-meta"><span><MapPin size={14} /> Mumbai, India</span><span>AI / SOFTWARE / HARDWARE</span><span>THIRD YEAR · TSEC</span></div>
          </div>
          <div className="hero-stage" aria-label="Interactive abstract node field"><div className="stage-coordinate">19°12&apos; N<br />72°52&apos; E</div><HeroOrb /><div className="stage-caption"><span>FIG. 01</span><span>IDEA → PROTOTYPE</span></div><div className="stage-crosshair" aria-hidden="true">+</div></div>
          <a className="scroll-cue" href="#work"><span>SCROLL TO EXPLORE</span><ArrowDown size={14} /></a>
          <div className="hero-index">BP / FIELD NOTES / 001</div>
        </section>

        <section className="signal-strip" aria-label="Profile snapshot"><span>BUILDING AT THE INTERSECTION OF</span><p>AI <b>×</b> SOFTWARE <b>×</b> THE PHYSICAL WORLD</p><span>LEARN BY BUILDING. COMPETE BY INNOVATING.</span></section>

        <section className="section work-section" id="work">
          <div className="section-heading"><div><p className="eyebrow section-kicker">02 / SELECTED BUILDS</p><h2>Work in<br /><em>progress.</em></h2></div><p className="section-aside">Ideas, prototypes and deployed work. Each record says what it is, what it does, and where it stands today.</p></div>
          <div className="project-grid">{projects.map((project, index) => <article className={`project-card project-card-${index + 1}`} key={project.id}>
            <div className="project-topline"><span>{project.category}</span><span>{project.status}</span></div>
            <div className="project-visual" aria-hidden="true"><span className="visual-index">BP / {String(index + 1).padStart(2, "0")}</span><span className={`project-glyph glyph-${index + 1}`}>{project.glyph}</span><span className="visual-coordinate">{project.field}</span></div>
            <div className="project-copy"><div className="project-title-row"><h3>{project.name}</h3><span className="project-year">{project.year}</span></div><p>{project.description}</p><div className="project-tags">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>
              <details className="project-details"><summary>Open field notes <MoveUpRight size={15} /></summary><div className="project-detail-content"><p><strong>Problem</strong>{project.problem}</p><p><strong>Approach</strong>{project.approach}</p><p><strong>My role</strong>{project.role}</p><p><strong>Current state</strong>{project.statusNote}</p>{project.link ? <a href={project.link} target="_blank" rel="noreferrer">Visit project <ArrowUpRight size={14} /></a> : null}</div></details>
            </div>
          </article>)}</div>
          <p className="section-footnote"><span>STATUS KEY</span> Idea · Research · Prototype · Deployed. No progress bars; just the current state.</p>
        </section>

        <section className="recognition-section" id="recognition"><div className="recognition-inner">
          <div className="section-heading recognition-heading"><div><p className="eyebrow section-kicker">03 / VERIFIED MILESTONES</p><h2>Proof, not<br /><em>just claims.</em></h2></div><p className="section-aside">Hackathons reward the build and the thinking behind it. Open a record to inspect the supporting document.</p></div>
          <div className="recognition-featured"><div className="recognition-stamp"><span>FIELD<br />PROOF</span><Compass size={39} strokeWidth={1} /></div>
            <div className="recognition-highlight"><span className="recognition-type">WINNER / LOGICAL TRACK</span><h3>Hack-It-Out<br />2.0</h3><p>Inter-collegiate hackathon · Department of Computer Science, Thakur College of Science and Commerce</p><span className="recognition-date">21—22 JAN 2026</span></div>
            <div className="recognition-highlight recognition-highlight-secondary"><span className="recognition-type">WINNER</span><h3>DevSprint<br />Mini Hackathon</h3><p>Built FoodConnect with a team at the TSEC ACM Student Chapter event, in collaboration with CodeCrafters.</p><span className="recognition-date">27 MAR 2026</span></div>
            <div className="recognition-highlight recognition-highlight-tertiary"><span className="recognition-type">ROUND 1 QUALIFIED</span><h3>Yatri<br />Hackathon</h3><p>Journey Coders · DataAstraa in collaboration with Yatri</p><span className="recognition-date">2025</span></div>
          </div>
          <CertificateGallery records={achievements} />
          <div className="discrepancy-note"><span className="note-mark">✓</span><p><strong>Verified Credentials</strong> All competition milestones, hackathon achievements, and technical certifications are backed by verified institutional certificates and working project builds.</p></div>
        </div></section>


        <section className="skills-section" id="skills"><div className="section skills-inner"><div className="section-heading"><div><p className="eyebrow section-kicker">04 / TOOLKIT</p><h2>Learning by<br /><em>layering.</em></h2></div><p className="section-aside">A working set, not a leaderboard. Skills are grouped by how they show up in the work.</p></div>
          <div className="skill-grid">{skillGroups.map((group, index) => <div className="skill-group" key={group.name}><span className="skill-number">0{index + 1}</span><h3>{group.name}</h3><div>{group.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div>)}</div>
        </div></section>

        <section className="map-section" id="midnight-express" aria-labelledby="midnight-express-title">
          <div className="section map-inner">
            <div className="section-heading map-heading">
              <div>
                <p className="eyebrow section-kicker">04.5 / CINEMATIC 3D EXPEDITION</p>
                <h2 id="midnight-express-title">The Midnight<br /><em>Express.</em></h2>
              </div>
              <p className="section-aside">Take a window seat in a vintage train carriage at night. Scroll to travel through the night landscape and explore 4 stations along the line.</p>
            </div>

            <MidnightExpress />

            <div className="map-copy-row">
              <div className="map-copy">
                <div className="map-badge">VINTAGE CARRIAGE · 4 STATIONS</div>
                <h3>Travel through the builds, cargo & terminus.</h3>
                <p>Sit back beside the warm table lamp and steaming chai. As the train rolls along the rails, look out the window to explore projects, inspect stenciled skill crates, wave at the builder&apos;s cottage, and collect your pass at the Terminus.</p>
                <ul>
                  <li><strong>01</strong> Projects Junction — Key software & hardware builds</li>
                  <li><strong>02</strong> Skills Central — Stacked cargo crates of tech stacks</li>
                  <li><strong>03</strong> About Town — The builder&apos;s cottage in Mumbai</li>
                  <li><strong>04</strong> Terminus: Contact — Passenger ticket with direct links</li>
                </ul>
              </div>
              <div className="map-universe-cta" style={{ display: "flex", flexDirection: "column", gap: 10, alignSelf: "center" }}>
                <a className="button" href="/universe" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)", color: "#FFFFFF", padding: "14px 26px", borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: "none", boxShadow: "0 0 25px rgba(217,119,6,0.4)" }}>
                  Fullscreen Carriage View 🚂 →
                </a>
                <span style={{ fontSize: 11, fontFamily: "monospace", color: "#94a3b8", textAlign: "center" }}>
                  Interactive vintage carriage with audio & easter eggs
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="community-section"><div className="community-mark">OUT<br />SIDE<br /><span>THE<br />IDE</span></div><div className="community-copy"><p className="eyebrow">05 / BEYOND THE EDITOR</p><h2>Good work<br />is <em>collaborative.</em></h2><p>Hackathon teams, student communities and conversations with people who build differently are part of the learning loop. I serve as Web & Content Management Head for the TSEC Cultural Committee and stay involved in technology and entrepreneurship events.</p><div className="community-tags"><span>TEAM BUILDER</span><span>HACKATHONS</span><span>ENTREPRENEURSHIP</span><span>HACKER HOUSE GOA 2026</span></div></div><div className="community-side-note">MEET<br />MAKE<br />REPEAT <ArrowDown size={18} /></div></section>

        <section className="contact-section" id="contact">
          <div className="contact-topline">
            <span>06 / NEXT COLLABORATION</span>
            <span>MUMBAI, INDIA · UTC +5:30</span>
          </div>
          <h2>Let&apos;s make<br /><em>something useful.</em></h2>
          <div className="contact-bottom">
            <p>Open to internships, thoughtful collaborations and ambitious problems worth prototyping.</p>
            <ContactTrigger className="contact-email">
              Start a conversation <ArrowUpRight size={18} />
            </ContactTrigger>
          </div>
          <div className="social-links">
            <a href="https://www.linkedin.com/in/bharat-patel-3aa703992" target="_blank" rel="noreferrer"><AtSign size={16} /> LinkedIn</a>
            <a href="https://github.com/bharatsec37" target="_blank" rel="noreferrer"><Link2 size={16} /> GitHub</a>
            <a href="https://wa.me/918470930964" target="_blank" rel="noreferrer"><MessageCircle size={16} /> WhatsApp</a>
            <a href="mailto:bharatpatelk2005@gmail.com"><Mail size={16} /> Email</a>
          </div>
        </section>
      </main>
      <footer className="site-footer"><span>© 2026 BHARAT PATEL</span><span>BUILT WITH CURIOSITY / KEPT IN MOTION</span><a href="#home">BACK TO TOP ↑</a></footer>
    </>
  );
}
