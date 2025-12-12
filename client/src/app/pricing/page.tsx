'use client';

import PageWrapper from "@/app/components/landing/PageWrapper";
import Pricing from "../components/landing/Pricing";
import { motion } from "motion/react";

export default function PricingPage() {
    return (
        <PageWrapper>
            <div className="max-w-7xl mx-auto px-4 mb-16">
                {/* Header Overlay to override component's internal header if needed, or just add context */}
                <div className="text-center mb-0 md:mb-8">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight"
                    >
                        Simple, transparent <span className="text-primary-red">pricing</span>.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-xl text-neutral-400 max-w-2xl mx-auto"
                    >
                        Start free, upgrade when you're ready to launch.
                    </motion.p>
                </div>

                {/* Reusing the Pricing component but allowing it to breathe */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <Pricing />
                </motion.div>

                {/* Comparison Table / Extra Info (Mockup for premium feel) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="mt-20 max-w-4xl mx-auto text-center"
                >

                </motion.div>
            </div>
        </PageWrapper>
    );
}
