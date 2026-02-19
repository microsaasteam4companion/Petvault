import { useParams, Link } from 'react-router-dom';
import { useMemo, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { getBlogBySlug, getRelatedBlogs } from "@/lib/blogUtils";
import { Badge } from "@/components/ui/badge";
import { Share2, Calendar, User, ArrowLeft, ArrowRight, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const BlogPost = () => {
    const { slug } = useParams<{ slug: string }>();
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);

    const blog = useMemo(() => getBlogBySlug(slug || ''), [slug]);
    const relatedBlogs = useMemo(() => blog ? getRelatedBlogs(blog) : [], [blog]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!blog) {
        return (
            <div className="min-h-screen flex flex-col pt-32 items-center justify-center">
                <h1 className="text-3xl font-bold">Blog not found</h1>
                <Link to="/blogs" className="mt-4 text-[#49B3E8] hover:underline">Back to all blogs</Link>
            </div>
        );
    }

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast({
            title: "Link copied",
            description: "Blog URL has been copied to clipboard.",
        });
        setTimeout(() => setCopied(false), 2000);
    };

    // Parse FAQ if exists in markdown or generate placeholders for demo
    // In a real scenario, we'd extract this from the markdown content.
    // For this implementation, I'll extract headers starting with "Frequently Asked Questions"

    return (
        <div className="min-h-screen bg-white">
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

            {/* Progress Bar (Optional) */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-[#49B3E8] origin-left z-[60]"
                initial={{ scaleX: 0 }}
                style={{ scaleX: 0 }} // This would normally be handled by a scroll hook
            />

            {/* Post Hero Section */}
            <article className="pt-24">
                <div className="container mx-auto max-w-[900px] px-6">
                    {/* Breadcrumbs / Back */}
                    <Link to="/blogs" className="inline-flex items-center gap-2 text-[#6F8A96] hover:text-[#0E2F44] transition-colors mb-8 group font-medium text-sm">
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Back to Articles
                    </Link>

                    {/* Meta & Title */}
                    <header className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <Badge className="bg-[#F2FAFD] text-[#49B3E8] border-none font-bold uppercase tracking-wider px-4 py-1.5 rounded-full text-[11px]">
                                {blog.category}
                            </Badge>
                            <span className="text-[#6F8A96] text-sm font-medium">{blog.date}</span>
                        </div>

                        <div className="relative group">
                            <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-[#0E2F44] leading-tight mb-8">
                                {blog.title}
                            </h1>
                            <button
                                onClick={handleCopyLink}
                                className="absolute -right-4 -top-4 md:-right-12 p-3 bg-white rounded-full shadow-lg border border-[#E5F4F9] hover:bg-[#F2FAFD] transition-all group"
                                aria-label="Copy blog link"
                            >
                                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-[#6F8A96]" />}
                            </button>
                        </div>

                        <div className="flex items-center justify-between py-6 border-y border-[#F2FAFD]">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-[#6F8A96] uppercase tracking-widest mr-2">Share</span>
                                <button onClick={handleCopyLink} className="w-10 h-10 rounded-full bg-[#F2FAFD] flex items-center justify-center text-[#49B3E8] hover:bg-[#49B3E8] hover:text-white transition-all shadow-sm">
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Featured Image */}
                    <div className="rounded-[40px] overflow-hidden mb-16 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-[#F2FAFD] aspect-video">
                        <img
                            src={blog.image}
                            alt={blog.imageAlt || blog.title}
                            className="w-full h-full object-cover"
                            loading="eager"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "https://images.unsplash.com/photo-1543466448-21d4992dc648?auto=format&fit=crop&q=80&w=1600&h=900";
                            }}
                        />
                    </div>

                    {/* Dynamic Content */}
                    <div className="prose prose-lg max-w-none prose-headings:text-[#0E2F44] prose-headings:font-bold prose-p:text-[#6F8A96] prose-p:leading-relaxed prose-strong:text-[#0E2F44] prose-img:rounded-[32px] prose-a:text-[#49B3E8] prose-a:no-underline hover:prose-a:underline">
                        <ReactMarkdown>{blog.content}</ReactMarkdown>
                    </div>

                    {/* FAQ CTA or Banner could go here */}

                    {/* Related Posts */}
                    {relatedBlogs.length > 0 && (
                        <section className="mt-24 pt-16 border-t border-[#F2FAFD]">
                            <h3 className="text-2xl font-bold text-[#0E2F44] mb-10 text-center">More from {blog.category}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                                {relatedBlogs.map(rb => (
                                    <Link key={rb.slug} to={`/blogs/${rb.slug}`} className="group block focus:outline-none">
                                        <div className="relative aspect-video rounded-3xl overflow-hidden mb-5 border border-[#F2FAFD] shadow-md group-hover:shadow-xl transition-all">
                                            <img
                                                src={rb.image}
                                                alt={rb.imageAlt || rb.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                loading="lazy"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = "https://images.unsplash.com/photo-1543466448-21d4992dc648?auto=format&fit=crop&q=80&w=1600&h=900";
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                        </div>
                                        <h4 className="font-bold text-[#0E2F44] group-hover:text-[#49B3E8] transition-colors line-clamp-2 leading-snug">
                                            {rb.title}
                                        </h4>
                                        <span className="text-[#49B3E8] text-xs font-bold mt-2 inline-block uppercase tracking-wider">Read Full Article</span>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </article>

            <Footer />
        </div>
    );
};

export default BlogPost;
