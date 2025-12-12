'use client';

import PageWrapper from "@/app/components/landing/PageWrapper";
import { motion } from "motion/react";

export default function AboutPage() {
    return (
        <PageWrapper>
            <div className="w-full min-h-screen flex flex-col items-center justify-center py-20 relative overflow-hidden">
                {/* Background Element for flair */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-red/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-5xl md:text-7xl font-bold text-white mb-12"
                    >
                        We are <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-red to-orange-500">Issa & Julius</span>.
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.7 }}
                        className="space-y-8 text-xl md:text-2xl text-neutral-300 leading-relaxed font-light"
                    >
                        <p>
                            Two ambitious students who noticed a pattern.
                        </p>

                        <p>
                            In the age of AI, the number of startups has exploded. Everyone is a founder now.
                            But let's be honest... <br />
                            <span className="text-white font-semibold">Most of them are trash.</span>
                        </p>

                        <p className="text-lg md:text-xl text-neutral-400">
                            We saw brilliant people build products for months, only to launch to silence.
                            The problem wasn't the code—it was the market.
                        </p>

                        <div className="pt-8">
                            <p className="text-2xl font-medium text-white mb-4">
                                Verdyct is our answer.
                            </p>
                            <p className="text-lg text-neutral-400">
                                We built this to stop the waste. To kill bad ideas before they kill your time.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </PageWrapper>
    );
}
