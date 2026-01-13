'use client';

import PageWrapper from "@/app/[locale]/components/landing/PageWrapper";
import { motion } from "motion/react";
import Image from "next/image";

export default function AboutPage() {
    return (
        <PageWrapper>
            <div className="max-w-6xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-5xl font-bold text-white mb-8 tracking-tight">
                            Building the <span className="text-primary-red">AI Architect</span> for modern founders.
                        </h1>
                        <div className="space-y-6 text-lg text-neutral-300 font-light leading-relaxed">
                            <p>
                                The startup landscape is noisy. Every day, thousands of ideas are born, but few survive the first contact with reality.
                            </p>
                            <p>
                                We built Verdyct to solve the "Founder's Blindness"—the tendency to fall in love with a solution before understanding the problem.
                            </p>
                            <p>
                                Our mission is simple: <strong>Kill bad ideas fast. Scale good ideas faster.</strong>
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 relative">
                            {/* Placeholder for team/office image - using a gradient pattern for now */}
                            <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-neutral-700 font-mono text-xs uppercase tracking-widest">
                                    [Verdyct HQ]
                                </span>
                            </div>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -z-10 top-10 -right-10 w-full h-full border border-white/5 rounded-2xl" />
                        <div className="absolute -z-10 -bottom-10 -left-10 w-full h-full border border-white/5 rounded-2xl" />
                    </motion.div>
                </div>

                <div className="mt-32">
                    <h2 className="text-3xl font-bold text-white mb-12 text-center">The Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                        {['Julius Peschard', 'Issa'].map((name, i) => (
                            <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-6 text-center hover:border-white/10 transition-colors">
                                <div className="w-24 h-24 bg-neutral-800 rounded-full mx-auto mb-4 border border-white/10" />
                                <h3 className="text-white font-medium text-lg">{name}</h3>
                                <p className="text-primary-red text-sm">Co-Founder</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}
