import { Star, StarHalf } from "lucide-react";
import WaveDivider from "./WaveDivider";
import { motion, useMotionValue, animate, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Dog Mom of 2",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    text: "PetVault gave me peace of mind I didn't know I needed. Every vaccine, every checkup — all in one beautiful timeline. No more digging through old papers!",
    rating: 5.0,
  },
  {
    name: "Michael Chen",
    role: "Cat & Dog Parent",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    text: "Managing health records for three pets used to be a nightmare. Now I have an organized life history for each one. Would love deeper export customization, but overall it's been incredibly helpful.",
    rating: 4.6,
  },
  {
    name: "Emily Rodriguez",
    role: "Veterinary Technician",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    text: "As a vet tech, I love when clients share their PetVault timeline with us. It makes consultations so much easier and faster. I recommend it to every pet parent.",
    rating: 4.8,
  },
  {
    name: "David Park",
    role: "First-Time Pet Owner",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    text: "As a new puppy parent, I was overwhelmed by all the vet appointments and shots. PetVault made it so simple to stay on top of everything. The reminders are a lifesaver.",
    rating: 4.3,
  },
  {
    name: "Lisa Thompson",
    role: "Rescue Volunteer",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    text: "We use PetVault for all our foster animals. It's easy to hand off a complete health history to adopters. The multi-pet profiles feature is exactly what we needed.",
    rating: 4.5,
  },
];

const RatingStars = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`f-${i}`} className="w-4 h-4 fill-accent text-accent" />
      ))}
      {hasHalf && <StarHalf className="w-4 h-4 fill-accent text-accent" />}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`e-${i}`} className="w-4 h-4 text-accent/30" />
      ))}
      <span className="text-xs text-muted-foreground ml-1.5 font-medium">{rating.toFixed(1)}</span>
    </div>
  );
};

const TestimonialsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const x = useMotionValue(0);
  const dragRef = useRef(false);

  // Duplicate for seamless loop
  const doubled = [...testimonials, ...testimonials];
  const cardWidth = 320;
  const gap = 28;
  const totalWidth = testimonials.length * (cardWidth + gap);

  useEffect(() => {
    let controls: ReturnType<typeof animate>;
    const startAnimation = () => {
      const currentX = x.get();
      const remaining = totalWidth + currentX;
      const duration = remaining / 40;

      controls = animate(x, -totalWidth, {
        duration,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
      });
    };

    if (!isPaused) {
      startAnimation();
    }

    return () => controls?.stop();
  }, [isPaused, x, totalWidth]);

  return (
    <section id="reviews" className="relative">
      <WaveDivider fill="#FFFFFF" />
      <div className="section-padding bg-card overflow-hidden">
        <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <p className="text-small font-semibold text-primary uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="text-section-title text-foreground font-poppins">
              Keeping Your Pet<br />Happy and Healthy
            </h2>
          </motion.div>
        </div>

        {/* Carousel with touch/swipe */}
        <motion.div
          ref={containerRef}
          className="overflow-hidden cursor-grab active:cursor-grabbing touch-pan-x"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => { setIsPaused(false); dragRef.current = false; }}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setTimeout(() => setIsPaused(false), 2000)}
        >
          <motion.div
            className="flex"
            style={{ x, gap: `${gap}px` }}
            drag="x"
            dragConstraints={{ left: -totalWidth, right: 0 }}
            dragElastic={0.1}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
            onDragStart={() => { setIsPaused(true); dragRef.current = true; }}
            onDragEnd={() => { dragRef.current = false; setTimeout(() => setIsPaused(false), 1500); }}
          >
            {doubled.map((t, i) => (
              <motion.div
                key={`${t.name}-${i}`}
                className="bg-card rounded-card p-6 shadow-card border border-border hover:shadow-card-hover transition-shadow duration-300 shrink-0"
                style={{ width: cardWidth, willChange: "transform" }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % testimonials.length) * 0.1, ease: [0.4, 0, 0.2, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-semibold text-foreground text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
                <RatingStars rating={t.rating} />
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">{t.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
