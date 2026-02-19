import { useState, useEffect, useRef, useCallback, memo, useMemo } from "react";
import { motion } from "framer-motion";
import WaveDivider from "./WaveDivider";
import { Search, Plus, Syringe, Weight, Stethoscope, UtensilsCrossed, PawPrint, Calendar, Activity, Check } from "lucide-react";

const filters = ["All", "Vaccines", "Weight", "Food", "Visits"];

const timelineEntries = [
  { icon: Syringe, label: "Rabies Vaccine", date: "Jan 5, 2026", tag: "Vaccine", tagColor: "bg-primary" },
  { icon: Weight, label: "Weight Check — 14.2kg", date: "Feb 12, 2026", tag: "Weight", tagColor: "bg-success" },
  { icon: UtensilsCrossed, label: "Switched to Salmon Diet", date: "Mar 1, 2026", tag: "Food", tagColor: "bg-secondary" },
  { icon: Stethoscope, label: "Annual Checkup", date: "Apr 8, 2026", tag: "Visit", tagColor: "bg-accent" },
  { icon: Syringe, label: "Bordetella Booster", date: "May 15, 2026", tag: "Vaccine", tagColor: "bg-primary" },
  { icon: Activity, label: "Weight Check — 14.8kg", date: "Jun 3, 2026", tag: "Weight", tagColor: "bg-success" },
  { icon: UtensilsCrossed, label: "Added Probiotics", date: "Jul 20, 2026", tag: "Food", tagColor: "bg-secondary" },
  { icon: Stethoscope, label: "Dental Cleaning", date: "Aug 10, 2026", tag: "Visit", tagColor: "bg-accent" },
];

const newEntry = { icon: Syringe, label: "Annual Checkup Completed", date: "May 2026", tag: "Vaccine", tagColor: "bg-primary" };

const SEARCH_TEXT = "Luna";
const LOOP_DURATION = 16000;
const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

const P = {
  CURSOR_FADE_IN: 300,
  CURSOR_AT_SEARCH: 1200,
  TYPE_START: 1500,
  TYPE_END: 3000,
  SEARCH_CAPTION_IN: 2000,
  SEARCH_CAPTION_OUT: 3800,
  FILTER_CURSOR_MOVE: 4200,
  FILTER_CLICK: 5000,
  FILTER_CAPTION_IN: 5200,
  FILTER_CAPTION_OUT: 6800,
  ADD_CURSOR_MOVE: 7200,
  ADD_CLICK: 7800,
  MODAL_IN: 8000,
  MODAL_OUT: 9200,
  NEW_ENTRY_IN: 9400,
  SUCCESS_PULSE: 9600,
  SUCCESS_END: 10200,
  ADD_CAPTION_IN: 9000,
  ADD_CAPTION_OUT: 10800,
  DRAG_START: 11000,
  DRAG_END: 13500,
  DRAG_CAPTION_IN: 11500,
  DRAG_CAPTION_OUT: 13200,
  CURSOR_FADE_OUT: 14000,
  RESET_START: 15200,
};

const captions = [
  "Find any moment instantly.",
  "Filter by vaccines, food, weight or visits.",
  "Log moments in seconds.",
  "Every chapter, beautifully organized.",
];

const AnimatedTimeline = memo(() => {
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0, visible: false, clicking: false });
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [weightValue, setWeightValue] = useState(14.1);
  const [scrollY, setScrollY] = useState(0);
  const [activeCaption, setActiveCaption] = useState(-1);
  const [captionOpacity, setCaptionOpacity] = useState(0);
  const [pawRipple, setPawRipple] = useState<{ x: number; y: number; key: number } | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const rafRef = useRef<number>(0);
  const startRef = useRef(0);
  const isMobile = useRef(false);
  const rippleKey = useRef(0);

  // Element refs for accurate cursor positioning
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const filterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const addBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    isMobile.current = window.innerWidth < 768;
  }, []);

  const getRelativeCenter = useCallback((el: HTMLElement | null) => {
    if (!el || !containerRef.current) return { x: 0, y: 0 };
    const container = containerRef.current.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    return {
      x: rect.left - container.left + rect.width / 2,
      y: rect.top - container.top + rect.height / 2,
    };
  }, []);

  const triggerPawRipple = useCallback((x: number, y: number) => {
    rippleKey.current += 1;
    setPawRipple({ x, y, key: rippleKey.current });
    setTimeout(() => setPawRipple(null), 500);
  }, []);

  const runLoop = useCallback(() => {
    const now = performance.now();
    const elapsed = (now - startRef.current) % LOOP_DURATION;
    const ms = isMobile.current ? 0.8 : 1;

    // No container fade — always visible
    // === PHASE 1: Search (0–4s) ===
    if (elapsed < P.CURSOR_FADE_IN) {
      setCursorPos({ x: 200, y: 200, visible: false, clicking: false });
    } else if (elapsed < P.CURSOR_AT_SEARCH) {
      const p = (elapsed - P.CURSOR_FADE_IN) / (P.CURSOR_AT_SEARCH - P.CURSOR_FADE_IN);
      const target = getRelativeCenter(searchRef.current);
      setCursorPos({ x: 200 + p * (target.x - 200), y: 200 + p * (target.y - 200), visible: true, clicking: false });
      setSearchFocused(false);
    } else if (elapsed < P.TYPE_START) {
      const target = getRelativeCenter(searchRef.current);
      setCursorPos({ x: target.x, y: target.y, visible: true, clicking: false });
      setSearchFocused(true);
    } else if (elapsed < P.TYPE_END) {
      const typeProgress = (elapsed - P.TYPE_START) / (P.TYPE_END - P.TYPE_START);
      const chars = Math.min(SEARCH_TEXT.length, Math.floor(typeProgress * (SEARCH_TEXT.length + 1)));
      setSearchText(SEARCH_TEXT.substring(0, chars));
      const target = getRelativeCenter(searchRef.current);
      setCursorPos({ x: target.x, y: target.y, visible: true, clicking: false });
    }

    // Caption 1
    if (elapsed >= P.SEARCH_CAPTION_IN && elapsed < P.SEARCH_CAPTION_OUT) {
      setActiveCaption(0);
      const fadeIn = Math.min(1, (elapsed - P.SEARCH_CAPTION_IN) / 400);
      const fadeOut = elapsed > P.SEARCH_CAPTION_OUT - 400 ? 1 - (elapsed - (P.SEARCH_CAPTION_OUT - 400)) / 400 : 1;
      setCaptionOpacity(Math.min(fadeIn, fadeOut));
    }

    // === PHASE 2: Filter click (4–7s) ===
    if (elapsed >= 4000 && elapsed < P.FILTER_CURSOR_MOVE) {
      setSearchFocused(false);
    }
    if (elapsed >= P.FILTER_CURSOR_MOVE && elapsed < P.FILTER_CLICK) {
      const p = (elapsed - P.FILTER_CURSOR_MOVE) / (P.FILTER_CLICK - P.FILTER_CURSOR_MOVE);
      const fromPos = getRelativeCenter(searchRef.current);
      const toPos = getRelativeCenter(filterRefs.current[1]);
      // Curved path
      const cx = fromPos.x + p * (toPos.x - fromPos.x);
      const cy = fromPos.y + p * (toPos.y - fromPos.y) + Math.sin(p * Math.PI) * 15;
      setCursorPos({ x: cx, y: cy, visible: true, clicking: false });
    } else if (elapsed >= P.FILTER_CLICK && elapsed < P.FILTER_CLICK + 150) {
      setCursorPos(prev => ({ ...prev, clicking: true }));
      const pos = getRelativeCenter(filterRefs.current[1]);
      triggerPawRipple(pos.x, pos.y);
    } else if (elapsed >= P.FILTER_CLICK + 150 && elapsed < 7000) {
      setCursorPos(prev => ({ ...prev, clicking: false }));
      setActiveFilter(1);
    }

    // Caption 2
    if (elapsed >= P.FILTER_CAPTION_IN && elapsed < P.FILTER_CAPTION_OUT) {
      setActiveCaption(1);
      const fadeIn = Math.min(1, (elapsed - P.FILTER_CAPTION_IN) / 400);
      const fadeOut = elapsed > P.FILTER_CAPTION_OUT - 400 ? 1 - (elapsed - (P.FILTER_CAPTION_OUT - 400)) / 400 : 1;
      setCaptionOpacity(Math.min(fadeIn, fadeOut));
    }

    // === PHASE 3: Add entry (7–11s) ===
    if (elapsed >= P.ADD_CURSOR_MOVE && elapsed < P.ADD_CLICK) {
      const p = (elapsed - P.ADD_CURSOR_MOVE) / (P.ADD_CLICK - P.ADD_CURSOR_MOVE);
      const fromPos = getRelativeCenter(filterRefs.current[1]);
      const toPos = getRelativeCenter(addBtnRef.current);
      const cx = fromPos.x + p * (toPos.x - fromPos.x);
      const cy = fromPos.y + p * (toPos.y - fromPos.y) + Math.sin(p * Math.PI) * -10;
      setCursorPos({ x: cx, y: cy, visible: true, clicking: false });
    } else if (elapsed >= P.ADD_CLICK && elapsed < P.ADD_CLICK + 150) {
      setCursorPos(prev => ({ ...prev, clicking: true }));
      const pos = getRelativeCenter(addBtnRef.current);
      triggerPawRipple(pos.x, pos.y);
    } else if (elapsed >= P.ADD_CLICK + 150 && elapsed < P.MODAL_IN) {
      setCursorPos(prev => ({ ...prev, clicking: false, visible: false }));
    }

    // Modal
    if (elapsed >= P.MODAL_IN && elapsed < P.MODAL_OUT) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }

    // New entry
    if (elapsed >= P.NEW_ENTRY_IN && elapsed < P.RESET_START) {
      setShowNewEntry(true);
    }
    if (elapsed >= P.SUCCESS_PULSE && elapsed < P.SUCCESS_END) {
      setShowSuccess(true);
    } else if (elapsed >= P.SUCCESS_END) {
      setShowSuccess(false);
    }

    // Caption 3
    if (elapsed >= P.ADD_CAPTION_IN && elapsed < P.ADD_CAPTION_OUT) {
      setActiveCaption(2);
      const fadeIn = Math.min(1, (elapsed - P.ADD_CAPTION_IN) / 400);
      const fadeOut = elapsed > P.ADD_CAPTION_OUT - 400 ? 1 - (elapsed - (P.ADD_CAPTION_OUT - 400)) / 400 : 1;
      setCaptionOpacity(Math.min(fadeIn, fadeOut));
    }

    // === PHASE 4: Drag scroll (11–14s) ===
    if (elapsed >= P.DRAG_START && elapsed < P.DRAG_END) {
      const p = (elapsed - P.DRAG_START) / (P.DRAG_END - P.DRAG_START);
      setScrollY(p * 100 * ms);
      setCursorPos({ x: 180, y: 180 + p * 40, visible: true, clicking: true });
    }

    // Caption 4
    if (elapsed >= P.DRAG_CAPTION_IN && elapsed < P.DRAG_CAPTION_OUT) {
      setActiveCaption(3);
      const fadeIn = Math.min(1, (elapsed - P.DRAG_CAPTION_IN) / 400);
      const fadeOut = elapsed > P.DRAG_CAPTION_OUT - 400 ? 1 - (elapsed - (P.DRAG_CAPTION_OUT - 400)) / 400 : 1;
      setCaptionOpacity(Math.min(fadeIn, fadeOut));
    }

    // === PHASE 5: Cursor fade out & invisible reset ===
    if (elapsed >= P.CURSOR_FADE_OUT && elapsed < P.RESET_START) {
      setCursorPos(prev => ({ ...prev, visible: false }));
      setCaptionOpacity(0);
      setActiveCaption(-1);
    }

    // Invisible reset — no container fade
    if (elapsed >= P.RESET_START) {
      setScrollY(0);
      setActiveFilter(0);
      setShowNewEntry(false);
      setSearchText("");
      setSearchFocused(false);
      setCursorPos({ x: 200, y: 200, visible: false, clicking: false });
      setWeightValue(14.1);
      setActiveCaption(-1);
      setCaptionOpacity(0);
    }

    // Ambient weight counter
    if (elapsed > 2000 && elapsed < 5000) {
      const wp = (elapsed - 2000) / 3000;
      setWeightValue(parseFloat((14.1 + wp * 0.1).toFixed(1)));
    }

    rafRef.current = requestAnimationFrame(runLoop);
  }, [triggerPawRipple, getRelativeCenter]);

  useEffect(() => {
    startRef.current = performance.now();
    rafRef.current = requestAnimationFrame(runLoop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [runLoop]);

  const visibleEntries = useMemo(() => {
    if (activeFilter === 0) return timelineEntries;
    const filterTag = ["", "Vaccine", "Weight", "Food", "Visit"][activeFilter];
    return timelineEntries.filter(e => e.tag === filterTag);
  }, [activeFilter]);

  return (
    <div
      ref={containerRef}
      className="p-5 select-none relative overflow-hidden"
      style={{ willChange: "transform" }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <PawPrint className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Luna's Timeline</p>
            <p className="text-[11px] text-muted-foreground">
              Golden Retriever · <span className="tabular-nums">{weightValue}kg</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            ref={searchRef}
            className="flex items-center gap-2 rounded-pill px-3 py-1.5 transition-all duration-300"
            style={{
              background: searchFocused ? "hsl(var(--card))" : "hsl(var(--muted))",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: searchFocused ? "hsl(var(--primary))" : "hsl(var(--border))",
              boxShadow: searchFocused ? "0 0 0 3px hsl(var(--primary) / 0.1)" : "none",
              transitionTimingFunction: EASE,
            }}
          >
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground min-w-[80px] relative">
              {searchText ? (
                <span className="text-foreground font-medium">
                  {searchText}
                  <span className="inline-block w-px h-3 bg-primary ml-px align-middle" style={{ animation: "demo-caret-blink 1s step-end infinite" }} />
                </span>
              ) : (
                "Search records..."
              )}
            </span>
          </div>
          <div ref={addBtnRef} className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Plus className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>
      </div>

      {/* Ambient progress bar */}
      <div className="h-0.5 bg-muted rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-primary/40 rounded-full"
          style={{
            width: `${Math.min(100, (scrollY / 100) * 100)}%`,
            transition: `width 0.3s ${EASE}`,
          }}
        />
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 mb-5 overflow-x-auto relative">
        {filters.map((f, i) => (
          <span
            key={f}
            ref={el => { filterRefs.current[i] = el; }}
            className={`text-xs font-medium px-3 py-1 rounded-pill whitespace-nowrap transition-all duration-500 relative ${i === activeFilter
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
              }`}
            style={{ transitionTimingFunction: EASE }}
          >
            {f}
            {i === activeFilter && (
              <span
                className="absolute inset-0 rounded-pill pointer-events-none"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
                  animation: "demo-shimmer 2s ease-in-out infinite",
                }}
              />
            )}
          </span>
        ))}
      </div>

      {/* Timeline container */}
      <div className="relative pl-6 border-l-2 border-border overflow-hidden" style={{ height: 260 }}>
        <div
          style={{
            transform: `translateY(-${scrollY}px)`,
            willChange: "transform",
            transition: "transform 0.15s linear",
          }}
        >
          {/* New entry at top */}
          {showNewEntry && (
            <div
              className="relative flex items-start gap-3 mb-3"
              style={{
                animation: `demo-entry-in 0.6s ${EASE} both`,
                willChange: "transform, opacity",
              }}
            >
              <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-card border-2 border-success" />
              <div
                className="flex-1 rounded-card p-3 bg-success/10"
                style={{
                  boxShadow: showSuccess
                    ? "0 0 16px rgba(50,195,108,0.25)"
                    : "0 0 0 transparent",
                  transition: `box-shadow 0.3s ${EASE}`,
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <newEntry.icon className="w-3.5 h-3.5 text-success" />
                    <p className="text-xs font-semibold text-foreground">{newEntry.label}</p>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-pill text-primary-foreground bg-success">
                    {showSuccess && <Check className="w-2.5 h-2.5" />}
                    {newEntry.tag}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {newEntry.date}
                </div>
              </div>
            </div>
          )}

          {/* Existing entries + duplicates for infinite scroll */}
          {[...visibleEntries, ...visibleEntries.slice(0, 4)].map((entry, i) => {
            const Icon = entry.icon;
            return (
              <div
                key={`${entry.label}-${entry.date}-${i}`}
                className="relative flex items-start gap-3 mb-3"
                style={{
                  animation: activeFilter !== 0 ? `demo-entry-in 0.4s ${EASE} ${i * 60}ms both` : undefined,
                  willChange: "transform, opacity",
                }}
              >
                <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-card border-2 border-primary relative">
                  {i === 0 && (
                    <span
                      className="absolute inset-0 rounded-full border border-primary"
                      style={{ animation: "demo-dot-pulse 2s ease-in-out infinite" }}
                    />
                  )}
                </div>
                <div className="flex-1 rounded-card p-3 bg-muted/50">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                      <p className="text-xs font-semibold text-foreground">{entry.label}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-pill text-primary-foreground ${entry.tagColor}`}>
                      {entry.tag}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {entry.date}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mini add-entry modal overlay */}
      {showModal && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center"
          style={{
            background: "hsl(var(--foreground) / 0.15)",
            animation: `demo-slide-in 0.3s ${EASE} both`,
          }}
        >
          <div
            className="bg-card rounded-card p-4 shadow-card-hover border border-border w-56"
            style={{ animation: `demo-entry-in 0.35s ${EASE} both` }}
          >
            <p className="text-xs font-semibold text-foreground mb-2">New Entry</p>
            <div className="h-2 bg-muted rounded-full mb-2 w-3/4" />
            <div className="h-2 bg-muted rounded-full mb-3 w-1/2" />
            <div className="flex justify-end">
              <span className="text-[10px] font-semibold bg-primary text-primary-foreground px-3 py-1 rounded-pill">Save</span>
            </div>
          </div>
        </div>
      )}

      {/* Premium hybrid cursor */}
      {cursorPos.visible && (
        <div
          className="absolute pointer-events-none z-20"
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
            transform: cursorPos.clicking ? "scale(0.88)" : "scale(1)",
            transition: `left 0.8s ${EASE}, top 0.8s ${EASE}, transform 0.15s ${EASE}, opacity 0.4s ${EASE}`,
            willChange: "transform, left, top, opacity",
            opacity: 1,
            filter: "drop-shadow(0 2px 6px hsl(var(--primary) / 0.25))",
          }}
        >
          {/* Outer glow ring */}
          <div
            className="absolute rounded-full"
            style={{
              width: 28,
              height: 28,
              top: -6,
              left: -6,
              background: "radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
              transform: cursorPos.clicking ? "scale(1.3)" : "scale(1)",
              transition: `transform 0.2s ${EASE}`,
            }}
          />
          <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
            <path
              d="M1 1L1 16L5.5 12L10 20L13 18.5L8.5 10.5L14 9.5L1 1Z"
              fill="white"
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      )}

      {/* Paw ripple effect */}
      {pawRipple && (
        <div
          key={pawRipple.key}
          className="absolute pointer-events-none z-15"
          style={{
            left: pawRipple.x - 12,
            top: pawRipple.y - 12,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ animation: `demo-paw-ripple 0.5s ${EASE} forwards` }}>
            <circle cx="12" cy="12" r="10" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" opacity="0.4" />
            <circle cx="8" cy="8" r="1.5" fill="hsl(var(--primary))" opacity="0.5" />
            <circle cx="12" cy="6" r="1.5" fill="hsl(var(--primary))" opacity="0.5" />
            <circle cx="16" cy="8" r="1.5" fill="hsl(var(--primary))" opacity="0.5" />
            <circle cx="12" cy="14" r="3" fill="hsl(var(--primary))" opacity="0.4" />
          </svg>
        </div>
      )}

      {/* Micro caption */}
      {activeCaption >= 0 && (
        <div
          className="absolute bottom-3 right-4 z-10"
          style={{
            opacity: captionOpacity,
            transform: `translateY(${captionOpacity < 0.5 ? 4 : 0}px)`,
            transition: `opacity 0.4s ${EASE}, transform 0.4s ${EASE}`,
            willChange: "opacity, transform",
          }}
        >
          <span className="text-[10px] font-medium text-muted-foreground bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-pill border border-border shadow-sm">
            {captions[activeCaption]}
          </span>
        </div>
      )}
    </div>
  );
});

AnimatedTimeline.displayName = "AnimatedTimeline";

const DemoSection = () => (
  <section id="product-demo" className="relative">
    <WaveDivider fill="#F2FAFD" />
    <div className="section-padding" style={{ background: "hsl(var(--light-section))" }}>
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <p className="text-small font-semibold text-primary uppercase tracking-widest mb-3">Product Demo</p>
          <h2 className="text-section-title text-foreground font-poppins mb-4">
            See Your Pet's Story<br />Come Alive
          </h2>
          <p className="text-body text-muted-foreground max-w-lg mx-auto">
            Watch your pet's entire health journey unfold in a beautiful, searchable timeline — every vaccine, every milestone, every moment that matters.
          </p>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="bg-card rounded-card-lg shadow-card overflow-hidden border border-border mx-auto w-full">
            <div className="flex items-center gap-2 px-3 sm:px-4 py-3 bg-muted border-b border-border">
              <div className="flex gap-1.5 shrink-0">
                <div className="w-2.5 h-2.5 sm:w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-2.5 h-2.5 sm:w-3 h-3 rounded-full bg-accent/80" />
                <div className="w-2.5 h-2.5 sm:w-3 h-3 rounded-full bg-success/60" />
              </div>
              <div className="flex-1 mx-2 sm:mx-8 min-w-0">
                <div className="bg-card rounded-all px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs text-muted-foreground text-center border border-border truncate">
                  app.petvault.com/timeline
                </div>
              </div>
            </div>
            <div className="p-3 sm:p-5">
              <AnimatedTimeline />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
    <WaveDivider fill="#FFFFFF" />
  </section>
);

export default DemoSection;
