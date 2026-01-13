
'use client';

import { useParams, useRouter } from "next/navigation";
import { posts } from "../posts";
import PageWrapper from "../../components/landing/PageWrapper";
import { motion } from "motion/react";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

export default function BlogPostPage() {
    const params = useParams();
    const router = useRouter();
    const { slug } = params;

    const post = posts.find(p => p.slug === slug);

    if (!post) {
        return (
            <PageWrapper>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                    <h1 className="text-4xl font-bold text-white mb-4">Post not found</h1>
                    <p className="text-neutral-400 mb-8">The article you are looking for does not exist.</p>
                    <Link href="/blog" className="text-primary-red hover:underline">
                        Return to Blog
                    </Link>
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <article className="max-w-4xl mx-auto px-6 mb-32 pt-10">
                <Link
                    href="/blog"
                    className="inline-flex items-center text-neutral-400 hover:text-white transition-colors mb-12 group bg-white/5 py-2 px-4 rounded-full border border-white/10 hover:bg-white/10"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Blog
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Header Section */}
                    <header className="mb-12">
                        <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-400 mb-6">
                            <span className="bg-primary-red/10 text-primary-red px-3 py-1 rounded-full font-bold uppercase tracking-wider text-xs border border-primary-red/20">{post.category}</span>
                            <span className="hidden md:inline w-1 h-1 bg-neutral-600 rounded-full"></span>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{post.readTime}</span>
                            </div>
                            <span className="hidden md:inline w-1 h-1 bg-neutral-600 rounded-full"></span>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{post.date}</span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
                            {post.title}
                        </h1>
                    </header>

                    {/* Featured Image */}
                    <div className="relative aspect-video w-full rounded-3xl overflow-hidden mb-16 border border-white/10 shadow-2xl shadow-primary-red/5">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${post.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60"></div>
                    </div>

                    {/* Content */}
                    <div
                        className="prose prose-invert prose-lg max-w-none 
                        prose-headings:text-white prose-headings:font-bold prose-headings:mb-6 prose-headings:mt-12
                        prose-h3:text-2xl prose-h3:tracking-tight
                        prose-p:text-neutral-300 prose-p:leading-8 prose-p:mb-8 prose-p:text-lg
                        prose-strong:text-white prose-strong:font-bold
                        prose-ul:text-neutral-300 prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-8 prose-ul:space-y-3
                        prose-li:marker:text-primary-red
                        prose-blockquote:border-l-4 prose-blockquote:border-primary-red prose-blockquote:bg-white/5 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic
                        prose-a:text-primary-red prose-a:no-underline prose-a:font-semibold hover:prose-a:underline
                        "
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </motion.div>

                {/* CTA Section */}
                <div className="border-t border-white/10 mt-20 pt-20">
                    <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] rounded-3xl p-8 md:p-16 text-center border border-white/10 overflow-hidden group">
                        <div className="absolute top-0 right-0 p-32 bg-primary-red/10 blur-[100px] rounded-full group-hover:bg-primary-red/20 transition-colors duration-700"></div>
                        <div className="absolute bottom-0 left-0 p-32 bg-blue-500/10 blur-[100px] rounded-full group-hover:bg-blue-500/20 transition-colors duration-700"></div>

                        <div className="relative z-10">
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to test your idea?</h3>
                            <p className="text-neutral-400 mb-10 max-w-lg mx-auto text-lg">
                                Stop guessing. Get a data-driven Predictive Opportunity Score for your startup concept in minutes.
                            </p>
                            <Link
                                href="/"
                                className="inline-block bg-primary-red text-white font-bold py-4 px-10 rounded-full hover:bg-red-600 hover:scale-105 transition-all shadow-lg shadow-primary-red/25"
                            >
                                Get Your Score Free
                            </Link>
                        </div>
                    </div>
                </div>
            </article>
        </PageWrapper>
    );
}
