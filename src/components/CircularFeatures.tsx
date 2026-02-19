import { Syringe, HeartPulse, Weight, BookOpen } from "lucide-react";
import circularBg from "@/assets/circular-features-bg.png";
import WaveDivider from "./WaveDivider";
import { motion } from "framer-motion";

const features = [
  { icon: Syringe, title: "Vaccine Tracking", desc: "Log every vaccine with dates, boosters, and reminders so you never miss a shot.", price: "$5/mo" },
  { icon: HeartPulse, title: "Illness & Treatment Logs", desc: "Record symptoms, diagnoses, medications, and recovery timelines in one place.", price: "$5/mo" },
  { icon: Weight, title: "Weight & Growth Monitoring", desc: "Track weight changes over time with visual charts and goal alerts.", price: "$5/mo" },
  { icon: BookOpen, title: "Behavior Notes Timeline", desc: "Document behavioral patterns, training milestones, and mood changes.", price: "$5/mo" },
];

const CircularFeatures = () => (
  <section className="relative" id="features">
    <WaveDivider fill="#49B3E8" />
    <div
      className="section-padding relative"
      style={{ background: "linear-gradient(180deg, #49B3E8 0%, #3a9fd4 100%)" }}
    >
      <img
        src={circularBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
      />
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <p className="text-small font-semibold text-primary-foreground/70 uppercase tracking-widest mb-3">Our Services</p>
          <h2 className="text-section-title text-primary-foreground font-poppins">
            Tailored Care Services<br />for Every Pet
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="bg-card rounded-[24px] p-8 sm:p-10 text-center shadow-card hover:shadow-card-hover transition-all duration-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <f.icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2 font-poppins">{f.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{f.desc}</p>
              <span className="inline-block bg-success/10 text-success text-xs font-semibold px-3 py-1 rounded-pill">
                From {f.price}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    <WaveDivider fill="#FFFFFF" />
  </section>
);

export default CircularFeatures;
