import { motion } from "framer-motion";
import WaveDivider from "./WaveDivider";
import { getAllBlogs } from "@/lib/blogUtils";
import { Link } from "react-router-dom";

const ease = [0.4, 0, 0.2, 1] as [number, number, number, number];

const PetHealthTips = () => {
  const allBlogs = getAllBlogs();
  const featured = allBlogs[0];
  const articles = allBlogs.slice(1, 3);

  if (!featured) return null;

  return (
    <section id="tips" className="relative">
      <WaveDivider fill="#FFFFFF" />
      <div className="section-padding bg-card">
        <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-14 gap-6"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease }}
          >
            <div>
              <span className="inline-block text-sm font-semibold text-foreground bg-accent px-5 py-1.5 rounded-full mb-5">
                Pet Health Tips
              </span>
              <h2 className="text-3xl md:text-[40px] leading-tight font-bold text-foreground font-poppins">
                Keeping Your Pet<br />Happy and Healthy
              </h2>
            </div>
            <p className="text-[15px] leading-relaxed text-muted-foreground max-w-sm lg:pt-2 lg:text-right">
              Explore valuable tips on maintaining your pet's optimal health, including proper nutrition, effective exercise routines, and addressing common health issues they may encounter.
            </p>
          </motion.div>

          {/* Two-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Featured – left 70% */}
            <motion.article
              className="lg:col-span-7 group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease }}
            >
              <Link to={`/blog/${featured.slug}`}>
                <div className="overflow-hidden rounded-[22px] mb-5 transition-shadow duration-300 ease-in-out group-hover:shadow-lg">
                  <motion.img
                    src={featured.image}
                    alt={featured.imageAlt || featured.title}
                    loading="lazy"
                    className="w-full h-[280px] sm:h-[360px] lg:h-[400px] object-cover"
                    initial={{ scale: 1.02 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease }}
                    whileHover={{ scale: 1.03 }}
                    style={{ transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)" }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mb-2.5">
                  {featured.author} <span className="mx-1.5 opacity-40">●</span> {new Date(featured.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <h3 className="text-xl md:text-2xl font-bold text-foreground font-poppins mb-2 group-hover:text-primary transition-colors duration-200">
                  {featured.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed max-w-lg line-clamp-2">
                  {featured.description}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {featured.tags.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="text-xs font-medium px-3.5 py-1 rounded-full border border-foreground/20 text-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.article>

            {/* Right 30% – stacked */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              {articles.map((a, i) => (
                <motion.article
                  key={a.slug}
                  className="group cursor-pointer flex flex-col sm:flex-row lg:flex-row gap-4"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: 0.1 * (i + 1), ease }}
                  whileHover={{ y: -4, transition: { duration: 0.3 } }}
                >
                  <Link to={`/blog/${a.slug}`} className="flex flex-col sm:flex-row gap-4 w-full">
                    <div className="overflow-hidden rounded-[18px] flex-shrink-0 sm:w-[180px] lg:w-[170px] transition-shadow duration-300 ease-in-out group-hover:shadow-lg">
                      <motion.img
                        src={a.image}
                        alt={a.imageAlt || a.title}
                        loading="lazy"
                        className="w-full h-44 sm:h-full object-cover"
                        initial={{ scale: 1.02 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease }}
                        whileHover={{ scale: 1.03 }}
                        style={{ transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)" }}
                      />
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <p className="text-xs text-muted-foreground mb-1.5">
                        {a.author} <span className="mx-1 opacity-40">●</span> {new Date(a.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      <h3 className="text-base md:text-lg font-bold text-foreground font-poppins mb-1.5 group-hover:text-primary transition-colors duration-200 leading-snug">
                        {a.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-2">
                        {a.description}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {a.tags.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="text-[11px] font-medium px-3 py-0.5 rounded-full border border-foreground/20 text-foreground"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PetHealthTips;
