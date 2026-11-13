"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  FileText,
  Maximize2,
  Menu,
  Pause,
  Play,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  achievementMediaById,
  type AchievementMedia,
  type AchievementRecord,
} from "@/lib/portfolio-data";

const subscribeNoop = () => () => {};

type NavigationItem = { label: string; target: string };

function MobileNav({ items }: { items: NavigationItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mobile-nav">
      <button
        className="mobile-menu-button"
        type="button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-menu-panel"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {items.map((item, index) => (
              <a
                key={item.target}
                href={`#${item.target}`}
                onClick={() => setOpen(false)}
              >
                <span>0{index + 1}</span>
                {item.label}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}

function CertificateGallery({ records }: { records: AchievementRecord[] }) {
  const categories = [
    "All",
    "Wins",
    "Hackathons",
    "Technical Activities",
    "Workshops",
    "Certifications",
    "Participation",
  ] as const;

  const [active, setActive] = useState<(typeof categories)[number]>("All");
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);

  // Event files modal (shows certificate + all photos for that event)
  const [openedEvent, setOpenedEvent] = useState<{
    record: AchievementRecord;
    media: AchievementMedia[];
  } | null>(null);

  // Entire screen lightbox
  const [fullscreenView, setFullscreenView] = useState<{
    record: AchievementRecord;
    media: AchievementMedia[];
    index: number;
  } | null>(null);

  const [zoom, setZoom] = useState(1);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [touchPaused, setTouchPaused] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const setWidthRef = useRef(0);
  const lastTimeRef = useRef(0);
  const touchStartX = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();

  // Lock body scroll when any modal is open
  useEffect(() => {
    if (openedEvent || fullscreenView) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [openedEvent, fullscreenView]);

  // Preferred order: Hack-It-Out 2.0 -> DevSprint -> Yatri -> Robotics -> SIH 2026 -> SIH 2025
  const preferredOrder = useMemo(
    () => [
      "hack-it-out-2026",
      "devsprint-2026",
      "yatri-2025",
      "robotics-workshop-2025",
      "sih-2026",
      "sih-2025",
    ],
    []
  );

  const orderIndex = useMemo(
    () => new Map(preferredOrder.map((id, index) => [id, index])),
    [preferredOrder]
  );

  const visibleRecords = useMemo(
    () =>
      records
        .filter(
          (record) => record.published && (active === "All" || record.category === active)
        )
        .sort(
          (left, right) =>
            (orderIndex.get(left.id) ?? 99) - (orderIndex.get(right.id) ?? 99)
        ),
    [records, active, orderIndex]
  );

  // Ensure set is always wide enough even when filtered down to 1-2 items
  const displayRecords = useMemo(() => {
    if (visibleRecords.length === 0) return [];
    let list = visibleRecords;
    while (list.length < 8) {
      list = [...list, ...visibleRecords];
    }
    return list;
  }, [visibleRecords]);

  // Pause state
  const isModalOpen = Boolean(openedEvent || fullscreenView);
  const paused = Boolean(
    reducedMotion ||
      hoverPaused ||
      focusPaused ||
      touchPaused ||
      manualPaused ||
      isModalOpen
  );

  // Measure single set width accurately
  useEffect(() => {
    const updateWidth = () => {
      if (setRef.current) {
        setWidthRef.current = setRef.current.getBoundingClientRect().width;
      }
    };
    updateWidth();
    // Re-check shortly after mount/images load
    const timer = setTimeout(updateWidth, 300);
    window.addEventListener("resize", updateWidth);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateWidth);
    };
  }, [displayRecords]);

  // Buttery-smooth, infinite continuous scrolling engine using RAF + GPU translate3d
  useEffect(() => {
    let animId: number;
    const speed = 42; // px per second

    const step = (now: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = now;
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      const safeDelta = Math.min(delta, 0.05);

      if (!paused && setWidthRef.current > 0) {
        offsetRef.current += speed * safeDelta;
        if (offsetRef.current >= setWidthRef.current) {
          offsetRef.current -= setWidthRef.current;
        }
        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
        }
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [paused]);

  const handleNext = () => {
    if (setWidthRef.current <= 0) return;
    offsetRef.current = (offsetRef.current + 360) % setWidthRef.current;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
    }
  };

  const handlePrev = () => {
    if (setWidthRef.current <= 0) return;
    offsetRef.current = (offsetRef.current - 360 + setWidthRef.current) % setWidthRef.current;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
    }
  };

  const mediaFor = (record: AchievementRecord): AchievementMedia[] =>
    achievementMediaById[record.id] ??
    (record.file
      ? [
          {
            file: record.file,
            label: record.recognition,
            kind: "Certificate",
            fileType: record.fileType ?? "image",
          },
        ]
      : []);

  // Keyboard navigation
  useEffect(() => {
    if (!fullscreenView && !openedEvent) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (fullscreenView) {
          setFullscreenView(null);
          setZoom(1);
        } else {
          setOpenedEvent(null);
        }
      } else if (fullscreenView && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
        event.preventDefault();
        const direction = event.key === "ArrowLeft" ? -1 : 1;
        setFullscreenView((current) => {
          if (!current) return null;
          const nextIndex =
            (current.index + direction + current.media.length) % current.media.length;
          return { ...current, index: nextIndex };
        });
        setZoom(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fullscreenView, openedEvent]);

  // Open the event showcase dialog
  const openEventFiles = (record: AchievementRecord) => {
    const media = mediaFor(record);
    if (media.length === 0) return;
    setOpenedEvent({ record, media });
  };

  const closeEventFiles = () => {
    setOpenedEvent(null);
  };

  // Open particular photo/file on entire screen
  const openFullscreen = (
    record: AchievementRecord,
    media: AchievementMedia[],
    index: number
  ) => {
    setZoom(1);
    setFullscreenView({ record, media, index });
  };

  const closeFullscreen = () => {
    setFullscreenView(null);
    setZoom(1);
  };

  const backToEventFiles = () => {
    setFullscreenView(null);
    setZoom(1);
  };

  const moveFullscreen = (direction: -1 | 1) => {
    setFullscreenView((current) => {
      if (!current) return null;
      const nextIndex =
        (current.index + direction + current.media.length) % current.media.length;
      return { ...current, index: nextIndex };
    });
    setZoom(1);
  };

  const renderAchievementCard = (
    record: AchievementRecord,
    index: number,
    keySuffix: string
  ) => {
    const media = mediaFor(record);
    const certificateMedia = media[0];

    return (
      <article
        className="achievement-card"
        key={`${record.id}-${index}-${keySuffix}`}
      >
        <div className="achievement-card-heading">
          <span className="achievement-index">
            EVENT {String((index % visibleRecords.length) + 1).padStart(2, "0")} · {String(media.length).padStart(2, "0")} {media.length === 1 ? "FILE" : "FILES"}
          </span>
          <span className="achievement-year">{record.year}</span>
        </div>
        <h3
          className="achievement-card-title"
          onClick={() => openEventFiles(record)}
          style={{ cursor: "pointer" }}
        >
          {record.name}
        </h3>
        <strong className="achievement-recognition">{record.recognition}</strong>
        <p className="achievement-organization">{record.organization}</p>

        {media.length > 0 && certificateMedia ? (
          <button
            className="achievement-open-group"
            type="button"
            aria-label={`Open ${record.name}, ${media.length} files`}
            onClick={(e) => {
              e.stopPropagation();
              openEventFiles(record);
            }}
          >
            <span className="achievement-cover-preview">
              {certificateMedia.fileType === "pdf" ? (
                <FileText size={34} />
              ) : (
                <Image
                  src={certificateMedia.file}
                  alt={certificateMedia.label}
                  fill
                  sizes="(max-width: 740px) 75vw, 25vw"
                />
              )}
            </span>
            <span className="achievement-file-count">
              {media.length} {media.length === 1 ? "FILE" : "FILES"}
            </span>
            <span className="achievement-cover-action">
              <span>Open event files</span>
              <ArrowUpRight size={14} />
            </span>
          </button>
        ) : (
          <div className="achievement-no-files">
            No event photos or certificate supplied
          </div>
        )}

        <p className="achievement-description">{record.description}</p>
      </article>
    );
  };

  return (
    <div className="certificate-gallery">
      <div className="gallery-toolbar">
        <div>
          <p className="eyebrow">ACHIEVEMENT ARCHIVE</p>
          <p className="gallery-count">
            {visibleRecords.length.toString().padStart(2, "0")} EVENTS /{" "}
            {visibleRecords
              .reduce((count, record) => count + mediaFor(record).length, 0)
              .toString()
              .padStart(2, "0")}{" "}
            FILES
          </p>
        </div>
        <div
          className="gallery-filters"
          role="tablist"
          aria-label="Filter certificates"
        >
          {categories.map((category) => (
            <button
              key={category}
              className={active === category ? "is-active" : ""}
              type="button"
              role="tab"
              aria-selected={active === category}
              onClick={() => setActive(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="achievement-rail-controls">
        <span aria-live="polite">
          {reducedMotion
            ? "MOTION REDUCED"
            : paused
            ? manualPaused
              ? "RAIL PAUSED (MANUAL)"
              : "RAIL PAUSED (HOVER / TAP)"
            : "AUTO-SCROLLING"}
        </span>
        <button
          type="button"
          aria-label="Scroll achievements left"
          title="Scroll left"
          onClick={handlePrev}
        >
          <ChevronLeft size={17} />
        </button>
        <button
          type="button"
          disabled={Boolean(reducedMotion)}
          aria-label={
            reducedMotion
              ? "Auto-scroll disabled by reduced motion"
              : manualPaused
              ? "Resume auto-scroll"
              : "Pause auto-scroll"
          }
          title={
            reducedMotion
              ? "Auto-scroll disabled by reduced motion"
              : manualPaused
              ? "Resume auto-scroll"
              : "Pause auto-scroll"
          }
          onClick={() => setManualPaused(!manualPaused)}
        >
          {manualPaused ? <Play size={15} /> : <Pause size={15} />}
        </button>
        <button
          type="button"
          aria-label="Scroll achievements right"
          title="Scroll right"
          onClick={handleNext}
        >
          <ChevronRight size={17} />
        </button>
      </div>

      {/* The scrolling viewport: pause on hover, touch, resume on leave/end */}
      <div
        className={`achievement-rail-viewport${paused ? " is-paused" : ""}`}
        ref={viewportRef}
        role="region"
        aria-label="Achievements, scrolls horizontally"
        onMouseEnter={() => setHoverPaused(true)}
        onMouseLeave={() => setHoverPaused(false)}
        onFocusCapture={() => setFocusPaused(true)}
        onBlurCapture={(event) => {
          if (
            !(event.relatedTarget instanceof Node) ||
            !event.currentTarget.contains(event.relatedTarget)
          ) {
            setFocusPaused(false);
          }
        }}
        onTouchStart={() => setTouchPaused(true)}
        onTouchEnd={() => setTouchPaused(false)}
        onTouchCancel={() => setTouchPaused(false)}
      >
        <div className="achievement-rail-track" ref={trackRef}>
          {/* Set 1: Master set for layout measurement */}
          <div className="achievement-rail-set" ref={setRef}>
            {displayRecords.map((record, index) =>
              renderAchievementCard(record, index, "s1")
            )}
          </div>
          {/* Set 2: Infinite loop seamless continuation */}
          <div className="achievement-rail-set" aria-hidden="true">
            {displayRecords.map((record, index) =>
              renderAchievementCard(record, index, "s2")
            )}
          </div>
          {/* Set 3: Extra safeguard for ultra-wide / 4K displays */}
          <div className="achievement-rail-set" aria-hidden="true">
            {displayRecords.map((record, index) =>
              renderAchievementCard(record, index, "s3")
            )}
          </div>
        </div>
      </div>

      {/* Portaled Modals: Guaranteed on top of document.body */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {/* Stage 1: Event Files Showcase Modal (shows Certificate + all photos for that event) */}
            {openedEvent && !fullscreenView && (
              <motion.div
                className="event-files-backdrop"
                role="dialog"
                aria-modal="true"
                aria-label={`${openedEvent.record.name} event files`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(event) => {
                  if (event.target === event.currentTarget) closeEventFiles();
                }}
              >
                <motion.div
                  className="event-files-panel"
                  initial={{ opacity: 0, scale: 0.96, y: 14 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 14 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="event-files-header">
                    <div>
                      <span className="eyebrow">
                        EVENT ARCHIVE · {openedEvent.record.year} · {openedEvent.media.length}{" "}
                        {openedEvent.media.length === 1 ? "FILE" : "FILES"}
                      </span>
                      <h2>{openedEvent.record.name}</h2>
                      <p className="event-files-subline">
                        <strong>{openedEvent.record.recognition}</strong> · {openedEvent.record.organization}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="modal-close"
                      aria-label="Close event files"
                      onClick={closeEventFiles}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="event-files-body">
                    <div className="event-files-instruction">
                      <p>{openedEvent.record.description}</p>
                      {openedEvent.record.link && (
                        <div style={{ margin: "10px 0" }}>
                          <a
                            href={openedEvent.record.link}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "6px 12px",
                              background: "rgba(198,255,61,0.12)",
                              border: "1px solid var(--lime)",
                              borderRadius: "4px",
                              color: "var(--lime)",
                              fontSize: "11px",
                              fontFamily: "var(--mono)",
                              textDecoration: "none",
                              letterSpacing: "0.04em",
                            }}
                          >
                            ↗ {openedEvent.record.linkText || "Visit project"} ({openedEvent.record.link.replace(/^https?:\/\//, "").replace(/\/$/, "")})
                          </a>
                        </div>
                      )}
                      <span className="instruction-badge">
                        Tap or click any photo/certificate to view full screen ⤢
                      </span>
                    </div>

                    <div
                      className={`event-files-grid files-count-${openedEvent.media.length}`}
                    >
                      {openedEvent.media.map((item, index) => (
                        <button
                          key={`${item.file}-${index}`}
                          type="button"
                          className="event-file-card"
                          onClick={() =>
                            openFullscreen(openedEvent.record, openedEvent.media, index)
                          }
                          title={`Open ${item.label} on entire screen`}
                        >
                          <div className="event-file-preview">
                            {item.fileType === "pdf" ? (
                              <div className="event-file-pdf">
                                <FileText size={44} />
                                <span>Official PDF</span>
                              </div>
                            ) : (
                              <Image
                                src={item.file}
                                alt={item.label}
                                fill
                                sizes="(max-width: 768px) 90vw, 30vw"
                                className="event-file-image"
                              />
                            )}
                            <span
                              className={`file-badge badge-${item.kind
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`}
                            >
                              {item.kind}
                            </span>
                            <span className="file-expand-hint">
                              <Maximize2 size={16} /> Entire Screen
                            </span>
                          </div>
                          <div className="event-file-info">
                            <span className="event-file-index">FILE 0{index + 1}</span>
                            <strong className="event-file-label">{item.label}</strong>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="event-files-footer">
                    <span>{openedEvent.record.name} · Click any item to expand full screen</span>
                    <button
                      type="button"
                      className="button button-dark"
                      onClick={closeEventFiles}
                    >
                      Close archive
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Stage 2: Entire Screen Lightbox */}
            {fullscreenView && (
              <motion.div
                className="fullscreen-lightbox"
                role="dialog"
                aria-modal="true"
                aria-label={`${fullscreenView.record.name} full screen view`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(event) => {
                  if (event.target === event.currentTarget) closeFullscreen();
                }}
              >
                <div className="fullscreen-header" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="fullscreen-back"
                    onClick={backToEventFiles}
                    aria-label="Back to event files"
                  >
                    <ChevronLeft size={16} /> Back to all files
                  </button>

                  <div className="fullscreen-title-group">
                    <span className="fullscreen-index">
                      FILE {fullscreenView.index + 1} / {fullscreenView.media.length}
                    </span>
                    <h3 className="fullscreen-heading">
                      {fullscreenView.media[fullscreenView.index].label}
                    </h3>
                  </div>

                  <div className="fullscreen-actions">
                    {fullscreenView.media[fullscreenView.index].fileType === "image" && (
                      <div className="fullscreen-zoom-group">
                        <button
                          type="button"
                          aria-label="Zoom out"
                          title="Zoom out"
                          disabled={zoom <= 0.75}
                          onClick={() => setZoom((z) => Math.max(0.75, z - 0.25))}
                        >
                          <ZoomOut size={16} />
                        </button>
                        <span className="zoom-value">{Math.round(zoom * 100)}%</span>
                        <button
                          type="button"
                          aria-label="Zoom in"
                          title="Zoom in"
                          disabled={zoom >= 3}
                          onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                        >
                          <ZoomIn size={16} />
                        </button>
                        <button
                          type="button"
                          className="zoom-reset-btn"
                          onClick={() => setZoom(1)}
                        >
                          Reset
                        </button>
                      </div>
                    )}
                    <button
                      type="button"
                      className="modal-close"
                      aria-label="Close full screen"
                      onClick={closeFullscreen}
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div
                  className="fullscreen-stage"
                  onClick={(e) => e.stopPropagation()}
                  onTouchStart={(e) => {
                    touchStartX.current = e.touches[0]?.clientX ?? null;
                  }}
                  onTouchEnd={(e) => {
                    const endX = e.changedTouches[0]?.clientX;
                    if (
                      touchStartX.current !== null &&
                      endX !== undefined &&
                      Math.abs(endX - touchStartX.current) > 45
                    ) {
                      moveFullscreen(endX < touchStartX.current ? 1 : -1);
                    }
                    touchStartX.current = null;
                  }}
                >
                  {fullscreenView.media.length > 1 && (
                    <>
                      <button
                        type="button"
                        className="stage-nav stage-nav-prev"
                        aria-label="Previous file"
                        title="Previous file (Left arrow)"
                        onClick={() => moveFullscreen(-1)}
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        type="button"
                        className="stage-nav stage-nav-next"
                        aria-label="Next file"
                        title="Next file (Right arrow)"
                        onClick={() => moveFullscreen(1)}
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}

                  <div className="stage-content">
                    {fullscreenView.media[fullscreenView.index].fileType === "pdf" ? (
                      <iframe
                        title={`${fullscreenView.record.name} PDF`}
                        src={fullscreenView.media[fullscreenView.index].file}
                        className="fullscreen-pdf-frame"
                      />
                    ) : (
                      <Image
                        key={fullscreenView.media[fullscreenView.index].file}
                        src={fullscreenView.media[fullscreenView.index].file}
                        alt={`${fullscreenView.record.name}: ${fullscreenView.media[fullscreenView.index].label}`}
                        width={2400}
                        height={1700}
                        sizes="100vw"
                        priority
                        className="fullscreen-image"
                        style={{
                          transform: `scale(${zoom})`,
                          transition: "transform 0.18s ease-out",
                        }}
                      />
                    )}
                  </div>
                </div>

                <div className="fullscreen-footer" onClick={(e) => e.stopPropagation()}>
                  <div className="fullscreen-meta">
                    <span className="file-kind-badge">
                      {fullscreenView.media[fullscreenView.index].kind}
                    </span>
                    <span>
                      {fullscreenView.record.name} · {fullscreenView.record.recognition}
                    </span>
                  </div>
                  <a
                    href={fullscreenView.media[fullscreenView.index].file}
                    target="_blank"
                    rel="noreferrer"
                    className="fullscreen-original-link"
                  >
                    Open original file <ArrowUpRight size={14} />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}

export { MobileNav, CertificateGallery };
