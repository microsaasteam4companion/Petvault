import { memo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Instagram, Linkedin, Mail, PawPrint } from "lucide-react";
import SubscribeForm from "./SubscribeForm";

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/entrext.labs", icon: Instagram },
  { label: "Discord", href: "https://discord.com/invite/ZZx3cBrx2", icon: DiscordIcon },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/entrext/posts/?feedView=all", icon: Linkedin },
  { label: "Substack", href: "https://entrextlabs.substack.com/subscribe", icon: SubstackIcon },
  { label: "Linktree", href: "https://linktr.ee/entrext.pro", icon: LinktreeIcon },
];

const ease = [0.4, 0, 0.2, 1] as const;

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease, staggerChildren: 0.15 } },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

const illustrationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease, delay: 0.2 } },
};

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm7.76 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
      <path d="M15.35 6.74c-.73-.33-1.5-.57-2.3-.7a.1.1 0 0 0-.1.05c-.1.18-.22.41-.3.59a9.26 9.26 0 0 0-3.3 0 6.47 6.47 0 0 0-.3-.59.1.1 0 0 0-.11-.05 12.36 12.36 0 0 0-2.3.7.09.09 0 0 0-.04.03C4.42 9.72 3.87 12.6 4.14 15.44a.1.1 0 0 0 .04.07c1.18.86 2.32 1.39 3.44 1.74a.1.1 0 0 0 .11-.04c.27-.36.5-.74.7-1.14a.1.1 0 0 0-.05-.14 8.1 8.1 0 0 1-1.17-.56.1.1 0 0 1-.01-.17c.08-.06.16-.12.23-.18a.1.1 0 0 1 .1-.01c2.46 1.12 5.12 1.12 7.55 0a.1.1 0 0 1 .1.01c.08.06.16.12.24.18a.1.1 0 0 1 0 .17c-.37.22-.76.4-1.17.56a.1.1 0 0 0-.06.14c.21.4.45.78.7 1.14a.1.1 0 0 0 .12.04c1.13-.35 2.27-.88 3.44-1.74a.1.1 0 0 0 .04-.07c.32-3.28-.53-6.13-2.25-8.67a.08.08 0 0 0-.04-.03Z" />
    </svg>
  );
}

function SubstackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16" />
      <path d="M4 10h16" />
      <path d="M4 14l8 5 8-5" />
    </svg>
  );
}

function LinktreeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18" />
      <path d="M8 7l4-4 4 4" />
      <path d="M8 13l4-4 4 4" />
      <path d="M6 19h12" />
    </svg>
  );
}

/* Soft illustration: pet + envelope + plant */
const SoftIllustration = memo(() => (
  <motion.div
    variants={illustrationVariants}
    className="relative w-full max-w-[220px] mx-auto lg:mx-0"
    style={{ animation: "community-float 4s ease-in-out infinite" }}
  >
    <div className="relative">
      {/* Plant left */}
      <svg className="absolute -left-4 bottom-0 w-8 h-12 text-primary/30" viewBox="0 0 32 48" fill="none">
        <path d="M16 48V20" stroke="currentColor" strokeWidth="2" />
        <ellipse cx="10" cy="18" rx="8" ry="12" fill="currentColor" opacity="0.3" transform="rotate(-15 10 18)" />
        <ellipse cx="22" cy="14" rx="7" ry="10" fill="currentColor" opacity="0.2" transform="rotate(10 22 14)" />
      </svg>

      {/* Main pet illustration */}
      <div className="w-36 h-36 mx-auto rounded-[28px] bg-primary/8 flex items-center justify-center relative">
        <PawPrint className="w-14 h-14 text-primary/40" />
        {/* Floating envelope */}
        <div className="absolute -top-3 -right-3 w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center" style={{ animation: "community-float 3s ease-in-out 0.5s infinite" }}>
          <Mail className="w-5 h-5 text-accent" />
        </div>
      </div>

      {/* Plant right */}
      <svg className="absolute -right-2 bottom-2 w-6 h-10 text-primary/25" viewBox="0 0 24 40" fill="none">
        <path d="M12 40V16" stroke="currentColor" strokeWidth="1.5" />
        <ellipse cx="12" cy="12" rx="6" ry="10" fill="currentColor" opacity="0.25" />
      </svg>
    </div>
  </motion.div>
));
SoftIllustration.displayName = "SoftIllustration";

export const SocialIcons = memo(({ compact = false, light = false }: { compact?: boolean; light?: boolean }) => (
  <div className={`flex items-center ${compact ? "gap-3" : "gap-4 md:gap-5"} ${compact ? "" : "justify-center lg:justify-start"}`}>
    {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
      <a
        key={label}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className={`${compact ? "w-9 h-9" : "w-10 h-10"} rounded-full flex items-center justify-center transition-all duration-300 will-change-transform hover:-translate-y-[3px]
          ${light
            ? "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:shadow-[0_4px_12px_hsl(199,76%,60%,0.25)]"
            : "bg-white/10 hover:bg-white/20 text-white/70 hover:text-white hover:shadow-[0_0_16px_hsl(199,76%,60%,0.25)]"
          }`}
      >
        <Icon className={compact ? "w-4 h-4" : "w-[18px] h-[18px]"} />
      </a>
    ))}
  </div>
));
SocialIcons.displayName = "SocialIcons";

const CommunitySection = memo(() => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="section-padding relative"
      style={{
        background: "linear-gradient(180deg, hsl(197, 78%, 97%) 0%, hsl(197, 60%, 96%) 50%, hsl(197, 78%, 97%) 100%)",
      }}
    >
      <motion.div
        className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8"
        variants={sectionVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {/* Floating card */}
        <motion.div
          variants={childVariants}
          className="max-w-[1000px] mx-auto bg-card rounded-[28px] p-6 sm:p-10 md:p-[60px]"
          style={{ boxShadow: "0 15px 40px rgba(0,0,0,0.06)" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
            {/* Left — Illustration + Text */}
            <div className="text-center lg:text-left">
              <SoftIllustration />

              <motion.h2
                variants={childVariants}
                className="font-poppins font-bold text-section-title text-foreground mt-8 mb-3"
              >
                Stay Connected With PetVault
              </motion.h2>

              <motion.p
                variants={childVariants}
                className="text-muted-foreground text-body max-w-md mx-auto lg:mx-0"
              >
                Helpful pet health insights, gentle reminders, and thoughtful updates — delivered with care.
              </motion.p>
            </div>

            {/* Right — Form + Social */}
            <div>
              <motion.div variants={childVariants}>
                <SubscribeForm variant="hero" />
              </motion.div>

              <motion.div variants={childVariants} className="mt-6">
                <SocialIcons light />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes community-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
      `}</style>
    </section>
  );
});
CommunitySection.displayName = "CommunitySection";

export default CommunitySection;
