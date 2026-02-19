import React, { memo } from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    q: "Do I need technical knowledge to use PetVault?",
    a: "Not at all. If you can use a notes app, you can use PetVault. It's designed to be simple and intuitive.",
  },
  {
    q: "What if I forget to log something?",
    a: "No worries. You can add entries anytime and even backdate them to keep your timeline accurate.",
  },
  {
    q: "Can I share records with my vet?",
    a: "Yes. You can generate organized summaries to share during visits.",
  },
  {
    q: "Will I get reminders?",
    a: "Yes. PetVault helps you remember vaccines, visits, and important milestones.",
  },
];

const ease = [0.4, 0, 0.2, 1] as const;

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

const FAQSection = memo(() => (
  <motion.section
    id="faq"
    className="section-padding bg-background"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.15 }}
    variants={sectionVariants}
  >
    <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-14">
        <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-xs font-semibold tracking-wide uppercase mb-4">
          FAQs
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Everything You're Wondering About PetVault
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto text-base">
          Your pet's life is full of moments. Here's how we help you keep track of them — safely and simply.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Featured FAQ Card – Left 40% */}
        <motion.div
          className="lg:col-span-2"
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="relative rounded-[22px] bg-primary/8 border border-primary/15 p-8 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 transition-all duration-300 will-change-transform">
            <div className="absolute top-5 right-5 w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <span className="inline-block px-3 py-1 rounded-full bg-primary/15 text-primary text-[11px] font-semibold uppercase tracking-wide mb-5">
              Most Asked
            </span>
            <h3 className="text-lg font-bold text-foreground mb-3 pr-10">
              Is my pet's health data safe?
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Yes. Your data is securely stored and encrypted. We don't sell your information. You control what you add, and you can delete your data anytime.
            </p>
          </div>
        </motion.div>

        {/* Accordion – Right 60% */}
        <div className="lg:col-span-3">
          <Accordion type="single" collapsible className="space-y-3">
            {faqItems.map((item, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.1 * (i + 1) }}
              >
                <AccordionItem
                  value={`faq-${i}`}
                  className="border border-border/60 rounded-2xl px-6 bg-card shadow-sm data-[state=open]:shadow-md transition-shadow duration-300"
                >
                  <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline py-5 min-h-[44px]">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  </motion.section>
));

FAQSection.displayName = "FAQSection";
export default FAQSection;
