import { Search, Filter, Syringe, Weight, UtensilsCrossed, Stethoscope, Calendar, PawPrint } from "lucide-react";
import { motion } from "framer-motion";

const timelineEntries = [
  { icon: Syringe, title: "Rabies Vaccine", date: "Jan 15, 2026", tag: "Vaccine", tagColor: "bg-primary" },
  { icon: Weight, title: "Weight: 14.2kg", date: "Jan 10, 2026", tag: "Weight", tagColor: "bg-success" },
  { icon: UtensilsCrossed, title: "Switched to Salmon Diet", date: "Dec 28, 2025", tag: "Food", tagColor: "bg-accent" },
  { icon: Stethoscope, title: "Annual Checkup — All Clear", date: "Dec 15, 2025", tag: "Visit", tagColor: "bg-secondary" },
  { icon: Syringe, title: "DHPP Booster", date: "Nov 20, 2025", tag: "Vaccine", tagColor: "bg-primary" },
];

const filters = ["All", "Vaccines", "Weight", "Food", "Visits"];

const highlights = [
  { title: "Smart Search", desc: "Find any record instantly across your pet's entire history." },
  { title: "Filter by Category", desc: "Isolate vaccines, weight logs, food changes, or vet visits with one tap." },
  { title: "Multi-Pet Profiles", desc: "Switch between pet profiles seamlessly within the same timeline." },
];

const TimelinePreview = () => (
  <section className="section-padding bg-card" id="timeline">
    <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Dashboard mockup */}
        <div className="bg-muted rounded-card-lg p-6 shadow-card">
          {/* Top bar */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <PawPrint className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Buddy's Timeline</p>
              <p className="text-xs text-muted-foreground">Golden Retriever · 3 years</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2 bg-card rounded-pill px-4 py-2 mb-4 border border-border">
            <Search className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Search records...</span>
            <Filter className="w-4 h-4 text-muted-foreground ml-auto" />
          </div>

          {/* Filter chips */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {filters.map((f, i) => (
              <span
                key={f}
                className={`text-xs px-3 py-1.5 rounded-pill font-medium ${i === 0
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground border border-border"
                  }`}
              >
                {f}
              </span>
            ))}
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            {timelineEntries.map((entry, i) => (
              <motion.div
                key={entry.title + entry.date}
                className="flex items-center gap-3 bg-card rounded-card p-3 border border-border"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className={`w-8 h-8 rounded-full ${entry.tagColor} flex items-center justify-center shrink-0`}>
                  <entry.icon className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{entry.title}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {entry.date}
                  </p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-pill ${entry.tagColor}/10 text-foreground font-medium`}>
                  {entry.tag}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right text */}
        <div>
          <p className="text-small font-semibold text-primary uppercase tracking-widest mb-3">Dashboard</p>
          <h2 className="text-section-title text-foreground mb-4 font-poppins">
            Google Timeline for Pet Health
          </h2>
          <p className="text-body text-muted-foreground mb-8">
            A visual, scrollable record of every health event in your pet's life. Search, filter, and share with any vet in seconds.
          </p>

          <div className="space-y-6">
            {highlights.map((h, i) => (
              <motion.div
                key={h.title}
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{h.title}</h3>
                  <p className="text-sm text-muted-foreground">{h.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default TimelinePreview;
