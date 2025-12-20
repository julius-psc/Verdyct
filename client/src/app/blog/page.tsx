'use client';

import PageWrapper from "@/app/components/landing/PageWrapper";
import { motion } from "motion/react";

import Link from "next/link";
import { posts } from "./posts";

export default function BlogPage() {
    return (
        <PageWrapper>
            <div className="max-w-6xl mx-auto px-6 py-20">
                <div className="mb-16">
                    <h1 className="text-5xl font-bold text-white mb-6">Latest Thinking</h1>
                    <p className="text-xl text-neutral-400 font-light">Insights on AI, startups, and the future of work.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {posts.map((post, i) => (
                        <Link href={`/blog/${post.slug}`} key={i} className="group h-full block">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="bg-[#1B1818] border border-white/5 rounded-2xl p-8 hover:border-white/20 transition-all h-full flex flex-col"
                            >
                                <div className="text-xs font-bold text-primary-red uppercase tracking-wider mb-4">
                                    {post.category}
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-primary-red transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-neutral-400 text-sm leading-relaxed mb-8 flex-grow">
                                    {post.excerpt}
                                </p>
                                <div className="text-xs text-neutral-600 font-mono">
                                    {post.date}
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </PageWrapper>
    );
}
