import { motion } from "framer-motion";
import { Syringe, Heart, Weight, FileText, Search, Users, Bell, BookOpen } from "lucide-react";

const features = [
  {
    title: "Vaccine Tracking",
    description: "Log every vaccine with reminders, boosters, and expiry alerts so you never miss a shot.",
    icon: Syringe,
    badge: "Included",
  },
  {
    title: "Illness & Treatment Logs",
    description: "Record symptoms, diagnoses, medications, and recovery timelines in one place.",
    icon: Heart,
    badge: "Included",
  },
  {
    title: "Weight & Growth Monitoring",
    description: "Track weight changes over time with visual charts and goal alerts.",
    icon: Weight,
    badge: "Included",
  },
  {
    title: "Behavior Notes Timeline",
    description: "Document behavioral patterns, training milestones, and mood changes.",
    icon: BookOpen,
    badge: "Included",
  },
  {
    title: "Secure Document Vault",
    description: "Store vet records, lab results, and certificates in encrypted cloud storage.",
    icon: FileText,
    badge: "Included",
  },
  {
    title: "Smart Search & Filters",
    description: "Find any entry instantly with powerful filters and timeline search.",
    icon: Search,
    badge: "Included",
  },
  {
    title: "Multi-Pet Profiles",
    description: "Manage health timelines for all your pets in one unified dashboard.",
    icon: Users,
    badge: "Included",
  },
  {
    title: "Automated Reminders",
    description: "Get notifications for upcoming vaccines, meds, and vet appointments.",
    icon: Bell,
    badge: "Included",
  },
];

const FeatureGrid = () => (
  <section className="relative py-24 lg:py-28 overflow-hidden bg-white">
    {/* Blue Forest Background */}
    <div className="absolute inset-0 z-0">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #4A9FD8 0%, #6AB8E3 50%, #8BC9EA 100%)",
        }}
      />

      {/* Forest Illustration Overlay */}
      <div className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 600'%3E%3Cg opacity='0.4'%3E%3Cpath d='M100 500 Q120 400 140 500' stroke='%2335758F' stroke-width='3' fill='none'/%3E%3Cpath d='M200 500 Q230 350 260 500' stroke='%2335758F' stroke-width='4' fill='none'/%3E%3Cpath d='M350 500 Q380 380 410 500' stroke='%2335758F' stroke-width='3' fill='none'/%3E%3Cellipse cx='150' cy='520' rx='15' ry='8' fill='%2360A85F'/%3E%3Cellipse cx='280' cy='515' rx='20' ry='10' fill='%2360A85F'/%3E%3Cellipse cx='400' cy='518' rx='18' ry='9' fill='%2360A85F'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "cover",
          backgroundPosition: "bottom",
        }}
      />

      {/* Soft blur effect */}
      <div className="absolute inset-0 backdrop-blur-[1px]" />
    </div>

    <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8 relative z-10">
      {/* Header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="inline-block bg-white/20 text-white text-xs font-semibold tracking-[0.15em] uppercase px-4 py-1.5 rounded-full mb-4 backdrop-blur-sm">
          OUR SERVICES
        </div>
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 font-poppins leading-tight">
          Tailored Care Services<br />
          for Every Pet
        </h2>
      </motion.div>

      {/* Grid - 4 columns x 2 rows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6">
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              className="group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              {/* Card */}
              <motion.div
                className="bg-white rounded-[24px] p-6 sm:p-8 lg:p-10 h-full flex flex-col items-center text-center relative"
                style={{
                  boxShadow: "0 20px 40px rgba(0,0,0,0.08), 0 0 40px rgba(74,159,216,0.15)",
                }}
                whileHover={{
                  y: -8,
                  boxShadow: "0 24px 48px rgba(0,0,0,0.12), 0 0 60px rgba(74,159,216,0.25)",
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
              >
                {/* Icon Container */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-[#E8F4F9] to-[#D5E9F2] flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#4A9FD8]" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-[#0E2F44] mb-3 font-poppins">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#6F8A96] leading-relaxed mb-6 flex-grow">
                  {feature.description}
                </p>

                {/* Green Badge */}
                <div className="inline-block bg-[#32C36C] text-white text-[10px] sm:text-xs font-semibold px-4 py-1.5 rounded-full">
                  {feature.badge}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default FeatureGrid;
