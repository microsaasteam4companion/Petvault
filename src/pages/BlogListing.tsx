import { useState, useMemo } from 'react';

import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { getAllBlogs, BlogPost } from "@/lib/blogUtils";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Search, LayoutGrid, LayoutList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const categories = [
    "All",
    "Records & Organization",
    "Health & Vet Management",
    "Daily Care",
    "Security & Data Protection",
    "Productivity & Lifestyle",
    "Product-Led Guides"
];

const BlogCard = ({ blog }: { blog: BlogPost }) => {
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement;
        target.src = "https://images.unsplash.com/photo-1543466448-21d4992dc648?auto=format&fit=crop&q=80&w=1600&h=900";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group bg-white rounded-[24px] overflow-hidden border border-[#E5F4F9] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col h-full"
        >
            <Link to={`/blogs/${blog.slug}`} className="relative block w-full aspect-[16/9] overflow-hidden">
                <img
                    src={blog.image}
                    alt={blog.imageAlt || blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    onError={handleImageError}
                />
                <Badge className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-primary border-none font-semibold hover:bg-white text-xs px-3 py-1">
                    {blog.category}
                </Badge>
            </Link>
            <div className="p-6 flex flex-col flex-1">
                <div className="text-xs text-[#6F8A96] mb-3 font-medium flex items-center gap-2">
                    <span>{blog.date}</span>
                </div>
                <Link to={`/blogs/${blog.slug}`}>
                    <h3 className="text-xl font-bold text-[#0E2F44] mb-3 group-hover:text-[#49B3E8] transition-colors leading-tight line-clamp-2">
                        {blog.title}
                    </h3>
                </Link>
                <p className="text-[#6F8A96] text-sm line-clamp-3 mb-6 flex-1">
                    {blog.description}
                </p>
                <Link
                    to={`/blogs/${blog.slug}`}
                    className="text-[#49B3E8] font-bold text-sm flex items-center gap-2 mt-auto group/btn"
                >
                    Read More
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
            </div>
        </motion.div>
    );
};

const BlogListing = () => {
    const allBlogs = useMemo(() => getAllBlogs(), []);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredBlogs = useMemo(() => {
        return allBlogs.filter(blog => {
            const matchesCategory = selectedCategory === "All" || blog.category === selectedCategory;
            const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                blog.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [allBlogs, selectedCategory, searchQuery]);

    const featuredBlog = useMemo(() => allBlogs[0], [allBlogs]);
    const normalBlogs = useMemo(() => filteredBlogs.filter(b => b.slug !== featuredBlog?.slug), [filteredBlogs, featuredBlog]);

    return (
        <div className="min-h-screen bg-[#F2FAFD]">
            {/* Back to Home Button */}
            <div className="fixed top-6 left-6 z-50">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-md border border-[#E5F4F9] rounded-full text-[#0E2F44] font-bold text-sm shadow-sm hover:shadow-md hover:bg-white transition-all group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to Home
                </Link>
            </div>

            {/* Hero Section */}
            <section className="pt-24 pb-16 px-6">
                <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-[#0E2F44] mb-6 tracking-tight">
                            Pet Care <span className="text-[#49B3E8]">Insights</span> & Guides
                        </h1>
                        <p className="text-[#6F8A96] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            Expert advice, practical tips, and deep dives into everything you need to know about managing your pet's health and life.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Featured Blog */}
            {selectedCategory === "All" && searchQuery === "" && featuredBlog && (
                <section className="px-6 mb-16">
                    <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[40px] overflow-hidden border border-[#E5F4F9] shadow-[0_20px_60px_rgba(0,0,0,0.06)] flex flex-col lg:flex-row min-h-[500px]"
                        >
                            <div className="lg:w-1/2 relative overflow-hidden aspect-video lg:aspect-auto">
                                <img
                                    src={featuredBlog.image}
                                    className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                                    alt={featuredBlog.imageAlt || featuredBlog.title}
                                    loading="eager"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = "https://images.unsplash.com/photo-1543466448-21d4992dc648?auto=format&fit=crop&q=80&w=1600&h=900";
                                    }}
                                />
                                <Badge className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm text-primary border-none font-semibold text-sm px-4 py-1.5 rounded-full shadow-lg">
                                    Latest Insight
                                </Badge>
                            </div>
                            <div className="lg:w-1/2 p-10 md:p-14 flex flex-col justify-center">
                                <div className="text-xs text-[#49B3E8] font-bold uppercase tracking-wider mb-4">
                                    {featuredBlog.category}
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-[#0E2F44] mb-6 leading-tight">
                                    {featuredBlog.title}
                                </h2>
                                <p className="text-[#6F8A96] text-lg mb-10 leading-relaxed line-clamp-3">
                                    {featuredBlog.description}
                                </p>
                                <Link
                                    to={`/blogs/${featuredBlog.slug}`}
                                    className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-[#0E2F44] text-white font-bold text-lg hover:bg-[#49B3E8] transition-all duration-300 shadow-xl group"
                                >
                                    Read Featured Blog
                                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Search & Filter */}
            <section className="px-6 mb-12">
                <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
                        {/* Filters */}
                        <div className="flex flex-wrap justify-center gap-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${selectedCategory === cat
                                        ? "bg-[#49B3E8] text-white shadow-lg"
                                        : "bg-white text-[#6F8A96] hover:bg-[#E5F4F9] hover:text-[#0E2F44]"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full lg:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6F8A96] w-4 h-4" />
                            <Input
                                placeholder="Search articles..."
                                className="pl-11 h-12 rounded-full border-[#E5F4F9] focus:ring-[#49B3E8] focus:border-[#49B3E8] bg-white shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="px-6 pb-24">
                <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
                    {normalBlogs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {normalBlogs.map((blog) => (
                                <BlogCard key={blog.slug} blog={blog} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-[40px] border border-[#E5F4F9]">
                            <h3 className="text-2xl font-bold text-[#0E2F44] mb-4">No articles found</h3>
                            <p className="text-[#6F8A96]">Try adjusting your search or category filters.</p>
                            <button
                                onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
                                className="mt-6 text-[#49B3E8] font-bold hover:underline"
                            >
                                Reset all filters
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default BlogListing;
