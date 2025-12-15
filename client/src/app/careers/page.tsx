'use client';

import PageWrapper from "@/app/components/landing/PageWrapper";
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

                <div className="grid grid-cols-1 gap-4 text-left">
                    <div className="p-8 rounded-2xl bg-[#1B1818] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-white/10 transition-all">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Full Stack Engineer</h3>
                            <div className="flex gap-4 text-sm text-neutral-500">
                                <span>Engineering</span>
                                <span>•</span>
                                <span>Remote</span>
                            </div>
                        </div>
                        <button className="px-6 py-2 rounded-full border border-white/10 text-white text-sm font-medium group-hover:bg-white group-hover:text-black transition-all">
                            Apply Now
                        </button>
                    </div>

                    <div className="p-8 rounded-2xl bg-[#1B1818] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-white/10 transition-all">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">AI Research Scientist</h3>
                            <div className="flex gap-4 text-sm text-neutral-500">
                                <span>AI / ML</span>
                                <span>•</span>
                                <span>London, UK</span>
                            </div>
                        </div>
                        <button className="px-6 py-2 rounded-full border border-white/10 text-white text-sm font-medium group-hover:bg-white group-hover:text-black transition-all">
                            Apply Now
                        </button>
                    </div>

                    <div className="p-12 rounded-2xl bg-white/5 border border-dashed border-white/10 text-center mt-8">
                        <h3 className="text-lg font-medium text-white mb-2">Don't see your role?</h3>
                        <p className="text-neutral-400 text-sm mb-6">
                            We are always looking for exceptional talent. If you think you can help us move the needle, we want to hear from you.
                        </p>
                        <a href="mailto:careers@verdyct.com" className="inline-flex items-center gap-2 text-primary-red hover:text-red-400 transition-colors text-sm font-bold uppercase tracking-wide">
                            Email us <IconArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}
