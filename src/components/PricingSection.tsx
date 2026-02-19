import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import WaveDivider from "./WaveDivider";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Basic",
    price: "$0",
    period: "/month",
    desc: "Perfect for tracking one pet.",
    features: [
      "1 Pet Profile",
      "Unlimited Timeline Entries",
      "Manual Tracking",
      "Basic Filtering",
      "15 Document Uploads",
      "In-App Reminders",
      "Basic Search",
    ],
    highlighted: false,
    buttonText: "Get Started",
  },
  {
    name: "Pro",
    price: "$5",
    period: "/month",
    badge: "Most Pet Parents Choose Pro",
    desc: "For serious pet parents.",
    features: [
      "Everything in Basic plus:",
      "Unlimited Pets",
      "Unlimited Documents",
      "Unlimited Reminders",
      "Recurring Reminders",
      "Email Reminders",
      "Advanced Search",
      "Vault Grid/List View",
      "Export PDF",
    ],
    highlighted: true,
    buttonText: "Upgrade to Pro — $5/month",
  },
];

const PricingSection = () => {
  const navigate = useNavigate();
  return (
    <section id="pricing">
      <WaveDivider fill="#F2FAFD" />
      <div className="section-padding" style={{ background: "#F2FAFD" }}>
        <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <p className="text-small font-semibold text-primary uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-section-title text-foreground font-poppins">
              Choose the Perfect Plan<br />for Your Furry Friend
            </h2>
            <p className="text-body text-muted-foreground mt-4 max-w-lg mx-auto">
              Simple, pet-parent friendly pricing. Start for free and upgrade as your family grows.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto items-stretch">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                className={`relative flex flex-col rounded-card-lg p-8 transition-all duration-300 ${plan.highlighted
                  ? "bg-[#0E2F44] text-white"
                  : "bg-white border border-border"
                  }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: plan.highlighted ? 0.18 : 0, ease: [0.4, 0, 0.2, 1] }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                style={{
                  boxShadow: plan.highlighted
                    ? "0 24px 50px rgba(14,47,68,0.15)"
                    : "var(--shadow-card)",
                }}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#49B3E8] text-white text-[10px] sm:text-xs font-bold px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap z-10">
                    {plan.badge}
                  </div>
                )}

                <div className="mb-8">
                  <p className={`text-sm font-semibold mb-2 ${plan.highlighted ? "text-[#49B3E8]" : "text-primary"}`}>
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold font-poppins">{plan.price}</span>
                    <span className={`text-sm ${plan.highlighted ? "text-white/60" : "text-muted-foreground"}`}>
                      {plan.period}
                    </span>
                  </div>
                  <p className={`text-sm mt-3 ${plan.highlighted ? "text-white/80" : "text-muted-foreground"}`}>
                    {plan.desc}
                  </p>
                </div>

                <ul className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[15px]">
                      <div className={`mt-1 rounded-full p-0.5 ${plan.highlighted ? "bg-[#49B3E8]/20" : "bg-primary/10"}`}>
                        <Check className={`w-3.5 h-3.5 shrink-0 ${plan.highlighted ? "text-[#49B3E8]" : "text-primary"}`} />
                      </div>
                      <span className={plan.highlighted ? "text-white/90" : "text-foreground/90"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.highlighted ? "nav" : "hero"}
                  size="lg"
                  onClick={() => navigate('/login')}
                  className={`w-full h-12 rounded-full text-[15px] font-semibold transition-all duration-300 ${plan.highlighted
                    ? "bg-[#49B3E8] hover:bg-[#A7DCE8] text-white border-none shadow-[0_8px_20px_rgba(73,179,232,0.3)]"
                    : "bg-[#0E2F44] hover:bg-[#1a4a6b] text-white border-none shadow-[0_8px_20px_rgba(14,47,68,0.1)]"
                    }`}
                >
                  {plan.buttonText}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
