'use client';

import PageWrapper from "@/app/components/landing/PageWrapper";
import { motion } from "motion/react";
import { IconArrowRight } from "@tabler/icons-react";

const positions = [
    { title: "Senior Full Stack Engineer", dept: "Engineering", type: "Remote", color: "border-blue-500/50" },
    { title: "AI Research Scientist", dept: "R&D", type: "San Francisco", color: "border-purple-500/50" },
    { title: "Product Designer", dept: "Design", type: "Remote", color: "border-pink-500/50" },
    { title: "Growth Marketing Manager", dept: "Marketing", type: "New York", color: "border-green-500/50" },
];

export default function CareersPage() {
    return (
        <PageWrapper>
            <div className="max-w-5xl mx-auto px-6 mb-32">
                <div className="text-center mb-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-5xl md:text-7xl font-bold text-white mb-6"
                    >
                        Join the <span className="text-primary-red">Resolution</span>.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-xl text-neutral-400 max-w-2xl mx-auto"
                    >
                        We are building the operating system for startup creation.
                    </motion.p>
                </div>

                <div className="grid gap-6">
                    {positions.map((job, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className={`group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer overflow-hidden`}
                        >
                            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${job.color} to-transparent`} />

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary-red transition-colors">{job.title}</h3>
                                    <div className="flex gap-4 text-sm text-neutral-400">
                                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5">{job.dept}</span>
                                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5">{job.type}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-white font-medium opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                    Apply Now <IconArrowRight className="w-5 h-5" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </PageWrapper>
    );
}
