import { FileWarning, FolderSearch, TrendingDown } from "lucide-react";
import problemIllustration from "@/assets/problem-illustration.png";
import { motion } from "framer-motion";

const problems = [
  { icon: FileWarning, title: "Lost vaccine dates", desc: "Can't remember when the last rabies shot was?" },
  { icon: FolderSearch, title: "Scattered medical files", desc: "Records across clinics, apps, and paper folders." },
  { icon: TrendingDown, title: "Forgotten growth history", desc: "No way to track weight changes over months." },
];

const ProblemSection = () => (
  <section className="section-padding bg-card">
    <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <div>
          <p className="text-small font-semibold text-primary uppercase tracking-widest mb-3">Why PetVault</p>
          <h2 className="text-section-title text-foreground mb-4 font-poppins">
            Information Chaos Ends Here
          </h2>
          <p className="text-body text-muted-foreground mb-8 max-w-md">
            Pet parents juggle paper records, multiple apps, and fading memories. Important health data gets lost between vet visits.
          </p>

          <div className="space-y-6">
            {problems.map((item, i) => (
              <motion.div
                key={item.title}
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src={problemIllustration}
            alt="Pet owner surrounded by scattered records"
            className="w-full max-w-md rounded-card"
          />
        </div>
      </motion.div>
    </div>
  </section>
);

export default ProblemSection;
