'use client';

import PageWrapper from "@/app/[locale]/components/landing/PageWrapper";
import { motion } from "motion/react";
import { IconArrowRight } from "@tabler/icons-react";

export default function CareersPage() {
    return (
        <PageWrapper>
            <div className="max-w-4xl mx-auto px-6 py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-5xl font-bold text-white mb-6">Join the Mission</h1>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-16">
                        We're building the intelligence layer for the next generation of startups.
                    </p>
                </motion.div>


                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <div className="p-12 rounded-2xl bg-white/5 border border-dashed border-white/10 text-center max-w-2xl">
                        <h3 className="text-2xl font-medium text-white mb-4">No Open Positions</h3>
                        <p className="text-neutral-400 mb-8 leading-relaxed">
                            We don't have any open roles at the moment, but things move fast at Verdyct.
                            Check back soon or follow us on social media for updates.
                        </p>
                        <a href="mailto:careers@verdyct.io" className="inline-flex items-center gap-2 text-primary-red hover:text-red-400 transition-colors text-sm font-bold uppercase tracking-wide">
                            General Inquiry <IconArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}
