import { Button } from "@/components/ui/button";
import contactIllustration from "@/assets/contact-illustration.png";
import WaveDivider from "./WaveDivider";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

const notifications = [
  "🐕 Vaccine reminder for Luna!",
  "📋 Vet visit logged successfully",
  "⚖️ Weight goal reached — 14kg!",
  "💊 Medication refill due tomorrow",
];

const ContactSection = () => {
  const [notifIndex, setNotifIndex] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const bgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowNotif(true);
      setTimeout(() => setShowNotif(false), 3000);
      setNotifIndex((prev) => (prev + 1) % notifications.length);
    }, 9000);

    const initial = setTimeout(() => {
      setShowNotif(true);
      setTimeout(() => setShowNotif(false), 3000);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(initial);
    };
  }, []);

  // Subtle parallax on background
  useEffect(() => {
    let raf: number;
    const tick = () => {
      if (bgRef.current) {
        const rect = bgRef.current.getBoundingClientRect();
        const viewH = window.innerHeight;
        const progress = (viewH - rect.top) / (viewH + rect.height);
        bgRef.current.style.transform = `translateY(${(progress - 0.5) * 12}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="contact" className="relative">
      <WaveDivider fill="#49B3E8" />
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #49B3E8 0%, #3a9fd4 100%)" }}
      >
        <img
          ref={bgRef}
          src={contactIllustration}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none"
          style={{ willChange: "transform" }}
        />

        {/* Subtle glow overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center 60%, rgba(255,255,255,0.08) 0%, transparent 60%)",
          }}
        />

        <div className="section-padding relative z-10">
          <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8 text-center relative">
            <div className="max-w-xl mx-auto">
              {/* Floating notification */}
              <AnimatePresence>
                {showNotif && (
                  <motion.div
                    className="absolute -top-2 right-0 md:right-8 bg-card rounded-card shadow-card px-4 py-2 flex items-center gap-2 z-20"
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <Bell className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-medium text-foreground whitespace-nowrap">{notifications[notifIndex]}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              >
                <h2 className="text-section-title text-primary-foreground font-poppins mb-4">
                  Join PetVault Today For<br />A Healthier Pet Tomorrow
                </h2>
                <p className="text-body text-primary-foreground/80 mb-8">
                  Join our community of pet lovers and start tracking your pet's health journey with ease.
                </p>
              </motion.div>

              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              >
                <Link to="/login">
                  <Button variant="nav" size="lg" className="rounded-full px-12 h-14 bg-white text-primary hover:bg-white/90 font-bold">
                    Get Started Now
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
