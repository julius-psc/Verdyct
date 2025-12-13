'use client';

import PageWrapper from "@/app/components/landing/PageWrapper";
import { motion } from "motion/react";
const heroBg = '/assets/illustrations/hero-bg.png'; // Placeholder

import Link from "next/link";
import { posts } from "./posts";

export default function BlogPage() {
    return (
        <PageWrapper>
            <div className="max-w-7xl mx-auto px-6 mb-32">
                <div className="text-center mb-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-5xl md:text-7xl font-bold text-white mb-6"
                    >
                        The <span className="text-primary-red">Verdyct</span> Blog
                    </motion.h1>
                    <p className="text-xl text-neutral-400">Insights from the frontier of data-driven entrepreneurship.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <Link href={`/blog/${post.slug}`} key={index} className="block h-full">
                            <motion.article
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="group relative bg-white/5 rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all hover:-translate-y-2 h-full"
                            >
                                <div className="h-48 overflow-hidden">
                                    <div
                                        className="w-full h-full bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
                                        style={{ backgroundImage: `url(${post.image})` }}
                                    />
                                </div>
                                <div className="p-8">
                                    <div className="flex items-center gap-4 text-xs text-neutral-400 mb-4">
                                        <span className="text-primary-red font-bold uppercase tracking-wider">{post.category}</span>
                                        <span>•</span>
                                        <span>{post.readTime}</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-4 leading-tight group-hover:text-primary-red transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                                        {post.excerpt}
                                    </p>
                                    <div className="text-neutral-500 text-xs">
                                        {post.date}
                                    </div>
                                </div>
                            </motion.article>
                        </Link>
                    ))}
                </div>
            </div>
        </PageWrapper>
    );
}
