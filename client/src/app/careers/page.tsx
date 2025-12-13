'use client';

import PageWrapper from "@/app/components/landing/PageWrapper";
import { motion } from "motion/react";
import { IconBriefcase } from "@tabler/icons-react";

export default function CareersPage() {
    return (
        <PageWrapper>
            <div className="max-w-5xl mx-auto px-6 mb-32 min-h-[50vh] flex flex-col items-center justify-center text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="w-24 h-24 bg-neutral-800 rounded-full flex items-center justify-center mb-8 border border-neutral-700"
                >
                    <IconBriefcase className="w-10 h-10 text-neutral-400" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-5xl md:text-7xl font-bold text-white mb-6"
                >
                    Coming <span className="text-primary-red">Soon</span>.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-xl text-neutral-400 max-w-2xl mx-auto"
                >
                    We're building something extraordinary. Open positions will be listed here shortly.
                </motion.p>
            </div>
        </PageWrapper>
    );
}
