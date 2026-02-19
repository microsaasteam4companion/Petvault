import { Button } from "@/components/ui/button";
import { Play, Syringe, Weight, UtensilsCrossed, Stethoscope, Heart, PawPrint, Pill, Activity, BarChart3, Plus, Check } from "lucide-react";
import heroIllustration from "@/assets/hero-illustration.png";
import WaveDivider from "./WaveDivider";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Link } from "react-router-dom";

type TimelineEntry = { icon: any; label: string; detail: string; color: string; bar?: number; date?: string };

const categoryEntries: Record<string, TimelineEntry[]> = {
  Vaccines: [
    { icon: Syringe, label: "Rabies Vaccine", detail: "Jan 2026", color: "bg-primary", date: "2026-01" },
    { icon: Syringe, label: "Booster Shot", detail: "Mar 2026", color: "bg-primary", date: "2026-03" },
    { icon: Syringe, label: "Annual Vaccination", detail: "May 2026", color: "bg-primary", date: "2026-05" },
  ],
  Food: [
    { icon: UtensilsCrossed, label: "Switched to Salmon Diet", detail: "Feb 2026", color: "bg-accent", date: "2026-02" },
    { icon: UtensilsCrossed, label: "Reduced Grain Intake", detail: "Mar 2026", color: "bg-accent", date: "2026-03-15" },
    { icon: Pill, label: "Added Supplements", detail: "Apr 2026", color: "bg-accent", date: "2026-04" },
  ],
  Weight: [
    { icon: Weight, label: "Jan — 13.8kg", detail: "", color: "bg-success", bar: 69, date: "2026-01" },
    { icon: Weight, label: "Feb — 14.0kg", detail: "", color: "bg-success", bar: 78, date: "2026-02" },
    { icon: Weight, label: "Mar — 14.2kg", detail: "", color: "bg-success", bar: 85, date: "2026-03" },
  ],
  Visits: [
    { icon: Stethoscope, label: "Annual Checkup", detail: "Jan 2026", color: "bg-secondary", date: "2026-01-10" },
    { icon: Stethoscope, label: "Skin Allergy Treatment", detail: "Mar 2026", color: "bg-secondary", date: "2026-03-10" },
    { icon: Stethoscope, label: "Dental Cleaning", detail: "May 2026", color: "bg-secondary", date: "2026-05-10" },
  ],
};

// "All" = most recent 4 entries across all categories, sorted descending
const allEntries: TimelineEntry[] = Object.values(categoryEntries)
  .flat()
  .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
  .slice(0, 4);

const categoryData: Record<string, TimelineEntry[]> = {
  All: allEntries,
  ...categoryEntries,
};

const filterChips = ["All", "Vaccines", "Weight", "Food", "Visits"];

const floatingIcons = [
  { icon: Heart, top: "10%", left: "5%", delay: 0 },
  { icon: PawPrint, top: "25%", right: "8%", delay: 1.5 },
  { icon: Pill, bottom: "30%", left: "10%", delay: 3 },
  { icon: Activity, top: "15%", right: "15%", delay: 2 },
];

const easeSmooth = [0.4, 0, 0.2, 1] as [number, number, number, number];

// Auto-cycle: All(0-3s) → Vaccines(3-6s) → Food(6-9s) → AddEntry(9-11s) → Weight(11-14s) → Visits(14-17s) → reset
const CATEGORY_ORDER = ["All", "Vaccines", "Food", "Food", "Weight", "Visits"] as const;
const CYCLE_DURATION = 18000;

const HeroSection = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [glowOpacity, setGlowOpacity] = useState(0.08);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [weightCounter, setWeightCounter] = useState(14.1);
  const [shadowScale, setShadowScale] = useState(1);
  const rafRef = useRef<number>(0);
  const startRef = useRef(performance.now());
  const parallaxRef = useRef<HTMLImageElement>(null);

  const visibleItems = useMemo(() => categoryData[activeFilter] || categoryData.All, [activeFilter]);

  // Combined RAF loop: breathing glow + auto-cycle + ambient shadow + parallax
  useEffect(() => {
    const tick = () => {
      const now = performance.now();
      const globalElapsed = (now - startRef.current) / 1000;

      // Breathing glow
      const glowVal = 0.08 + 0.06 * Math.sin((globalElapsed / 5) * Math.PI * 2);
      setGlowOpacity(glowVal);

      // Breathing shadow
      const shadowVal = 1 + 0.03 * Math.sin((globalElapsed / 4) * Math.PI * 2);
      setShadowScale(shadowVal);

      // Auto-cycle
      const cycleElapsed = ((now - startRef.current) % CYCLE_DURATION);

      if (cycleElapsed < 3000) {
        setActiveFilter("All");
        setShowNewEntry(false);
        setShowSuccess(false);
      } else if (cycleElapsed < 6000) {
        setActiveFilter("Vaccines");
        setShowNewEntry(false);
        setShowSuccess(false);
      } else if (cycleElapsed < 9000) {
        setActiveFilter("Food");
        setShowNewEntry(false);
        setShowSuccess(false);
      } else if (cycleElapsed < 11000) {
        // Add entry phase (still Food)
        setActiveFilter("Food");
        if (cycleElapsed > 9800) {
          setShowNewEntry(true);
          if (cycleElapsed > 10200 && cycleElapsed < 10800) {
            setShowSuccess(true);
          } else {
            setShowSuccess(false);
          }
        }
      } else if (cycleElapsed < 14000) {
        setActiveFilter("Weight");
        setShowNewEntry(false);
        setShowSuccess(false);
        const wp = (cycleElapsed - 11000) / 3000;
        setWeightCounter(parseFloat((14.1 + wp * 0.1).toFixed(1)));
      } else if (cycleElapsed < 17000) {
        setActiveFilter("Visits");
        setShowNewEntry(false);
        setShowSuccess(false);
      } else {
        // Brief reset window
        setActiveFilter("All");
        setShowNewEntry(false);
        setShowSuccess(false);
        setWeightCounter(14.1);
      }

      // Parallax on scroll
      if (parallaxRef.current) {
        const scrollY = window.scrollY;
        parallaxRef.current.style.transform = `translateY(${scrollY * 0.015}px)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleFilterClick = useCallback((chip: string) => {
    setActiveFilter(chip);
    startRef.current = performance.now(); // reset cycle
  }, []);

  return (
    <section className="relative overflow-hidden pt-16">
      <div
        className="pt-32 pb-16 relative"
        style={{
          minHeight: "85vh",
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(135deg, hsl(var(--hero-gradient-from)) 0%, hsl(var(--hero-gradient-to)) 40%, hsl(var(--hero-gradient-from)) 70%, hsl(var(--hero-gradient-to)) 100%)",
          backgroundSize: "300% 300%",
          animation: "hero-gradient-shift 15s ease-in-out infinite",
        }}
      >
        {/* Soft vignette corners */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 60%, rgba(14,47,68,0.06) 100%)",
          }}
        />

        {/* Floating dust particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`dust-${i}`}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 3 + (i % 3) * 2,
              height: 3 + (i % 3) * 2,
              background: "rgba(255,255,255,0.25)",
              top: `${15 + i * 12}%`,
              left: `${10 + i * 15}%`,
              animation: `hero-dust ${12 + i * 2}s ease-in-out infinite ${i * 2}s`,
            }}
          />
        ))}

        {/* Floating background icons */}
        {floatingIcons.map((item, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none opacity-[0.08] text-primary-foreground"
            style={{
              top: item.top,
              left: item.left,
              right: (item as any).right,
              bottom: (item as any).bottom,
            }}
            animate={{ y: [0, -12, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: item.delay,
            }}
          >
            <item.icon className="w-10 h-10" />
          </motion.div>
        ))}

        <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="text-center lg:text-left relative">
              {/* Headline glow */}
              <div
                className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-40 pointer-events-none rounded-full"
                style={{
                  background: "radial-gradient(ellipse at center, rgba(255,255,255,0.3) 0%, transparent 70%)",
                  animation: "hero-headline-glow 5s ease-in-out infinite",
                }}
              />
              <motion.h1
                className="text-5xl md:text-[52px] lg:text-[60px] leading-[1.15] text-primary-foreground mb-6 font-poppins font-bold relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: easeSmooth }}
              >
                You'll Forget Moments. We Won't.
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl leading-relaxed text-primary-foreground/85 mb-8 max-w-xl mx-auto lg:mx-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.15, ease: easeSmooth }}
              >
                From their first vaccine to their latest zoomies — PetVault
                quietly preserves every chapter of your pet's life.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25, ease: easeSmooth }}
              >
                <Button
                  variant="hero"
                  size="default"
                  className="h-11 sm:h-12 px-6 text-[14px] sm:text-[15px] font-medium transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_8px_20px_rgba(50,195,108,0.3)] active:scale-[0.98]"
                  asChild
                >
                  <Link to="/signup">
                    Start Free
                  </Link>
                </Button>
                <Button
                  variant="hero-outline"
                  size="default"
                  className="h-11 sm:h-12 px-6 text-[14px] sm:text-[15px] font-medium transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_4px_16px_rgba(73,179,232,0.2)] active:scale-[0.98]"
                  asChild
                >
                  <a href="#product-demo">
                    <Play className="w-4 h-4" />
                    View Demo
                  </a>
                </Button>
              </motion.div>
            </div>

            {/* Right */}
            <motion.div
              className="relative flex justify-center"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.35, ease: easeSmooth }}
            >
              {/* Illustration with subtle parallax */}
              <img
                ref={parallaxRef}
                src={heroIllustration}
                alt="Veterinarian with pet owner and puppy in a clinic"
                className="w-full max-w-md rounded-card-lg relative z-[1]"
                style={{ willChange: "transform" }}
              />

              {/* Radial glow behind timeline card */}
              <div
                className="absolute -bottom-8 -left-8 lg:-left-4 w-80 h-48 pointer-events-none z-[2]"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(255,255,255,0.25) 0%, transparent 70%)",
                  opacity: glowOpacity,
                  transition: "opacity 0.5s ease",
                }}
              />

              {/* Floating dashboard card — 85% desktop, 70% mobile */}
              <motion.div
                className="absolute z-[3] bg-card rounded-card p-3 w-56 lg:w-56 
                  -bottom-4 -left-4 lg:left-0
                  scale-[0.70] origin-bottom-left sm:scale-[0.70] lg:scale-[0.85]"
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  boxShadow: `0 10px ${25 * shadowScale}px rgba(0,0,0,${0.06 * shadowScale})`,
                  willChange: "transform",
                }}
              >
                {/* Filter chips */}
                <div className="flex gap-1 mb-2 overflow-hidden flex-wrap">
                  {filterChips.map((chip) => (
                    <span
                      key={chip}
                      onClick={() => handleFilterClick(chip)}
                      className={`text-[8px] px-1.5 py-0.5 rounded-full transition-all duration-300 cursor-pointer relative ${chip === activeFilter
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                    >
                      {chip}
                      {chip === activeFilter && (
                        <span
                          className="absolute inset-0 rounded-full pointer-events-none"
                          style={{
                            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)",
                            animation: "demo-shimmer 2.5s ease-in-out infinite",
                          }}
                        />
                      )}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                    Pet Timeline
                  </p>
                  {/* Status dot */}
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                  </span>
                </div>

                {/* New entry slide-in */}
                <AnimatePresence>
                  {showNewEntry && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -8, height: 0 }}
                      transition={{ duration: 0.4, ease: easeSmooth }}
                      className="mb-1.5"
                    >
                      <div className="flex items-center gap-2 bg-success/10 rounded-lg p-1.5"
                        style={{
                          boxShadow: showSuccess ? "0 0 12px rgba(50,195,108,0.2)" : "none",
                          transition: "box-shadow 0.3s ease",
                        }}
                      >
                        <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center shrink-0">
                          {showSuccess ? (
                            <Check className="w-2.5 h-2.5 text-primary-foreground" />
                          ) : (
                            <Plus className="w-2.5 h-2.5 text-primary-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] font-semibold text-foreground">New food log added</p>
                          <p className="text-[8px] text-muted-foreground">Just now</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-1.5 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeFilter}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3, ease: easeSmooth }}
                      className="space-y-1.5"
                    >
                      {visibleItems.map((item, idx) => (
                        <div key={item.label} className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full ${item.color} flex items-center justify-center shrink-0`}
                          >
                            <item.icon className="w-3 h-3 text-primary-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-semibold text-foreground truncate">
                              {item.label}
                            </p>
                            {item.detail && (
                              <p className="text-[9px] text-muted-foreground">
                                {item.detail}
                              </p>
                            )}
                            {item.bar !== undefined && (
                              <div className="h-1 bg-muted rounded-full mt-0.5 w-full">
                                <motion.div
                                  className="h-full bg-success rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${item.bar}%` }}
                                  transition={{ duration: 0.6, delay: idx * 0.1, ease: easeSmooth }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Weight counter animation */}
                      {activeFilter === "Weight" && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center mt-1"
                        >
                          <p className="text-[9px] text-muted-foreground">
                            Current: <span className="font-bold text-foreground tabular-nums">{weightCounter}kg</span>
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
      <WaveDivider fill="#FFFFFF" />
    </section>
  );
};

export default HeroSection;
