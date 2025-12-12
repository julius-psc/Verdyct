'use client';

import PageWrapper from "@/app/components/landing/PageWrapper";
import { motion } from "motion/react";
import Image from "next/image";

// Placeholder images - in real app would be team photos

export default function CompanyPage() {
    return (
        <PageWrapper>
            <div className="w-full">
                {/* Hero Section */}
                <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-black/50 z-10" />
                    <motion.div
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 10, ease: "linear" }}
                        className="absolute inset-0 z-0 bg-cover bg-center opacity-50"
                        style={{ backgroundImage: `url('/assets/illustrations/hero-bg.png')` }}
                    />

                    <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tighter"
                        >
                            We build <span className="text-primary-red">clarity</span>.
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.7 }}
                            className="text-2xl text-white/80 font-light"
                        >
                            Verdyct is on a mission to democratize venture capital intelligence.
                        </motion.p>
                    </div>
                </div>

                {/* Mission Text */}
                <div className="max-w-4xl mx-auto px-6 py-24 text-center">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-3xl text-neutral-300 font-light leading-normal"
                    >
                        We believe that great ideas can come from anywhere. But execution is what matters. By combining AI with proven business logic, we give every founder the tools to validate, refine, and launch with confidence.
                    </motion.p>
                </div>

                {/* Stats */}
                <div className="border-y border-white/10 bg-white/5 py-16">
                    <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">10k+</div>
                            <div className="text-sm text-neutral-400 uppercase tracking-widest">Ideas Analyzed</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">$50M+</div>
                            <div className="text-sm text-neutral-400 uppercase tracking-widest">Potential Value</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">4</div>
                            <div className="text-sm text-neutral-400 uppercase tracking-widest">AI Agents</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">24/7</div>
                            <div className="text-sm text-neutral-400 uppercase tracking-widest">Uptime</div>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}
