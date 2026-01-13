'use client';

import PageWrapper from "@/app/[locale]/components/landing/PageWrapper";
import { motion } from "motion/react";
import { IconBrain, IconChartBar, IconRocket, IconSpy, IconTargetArrow, IconZoomMoney } from "@tabler/icons-react";

const features = [
    {
        title: "AI Analyst",
        description: "Your dedicated VC partner. Our AI Analyst dissects your business model, identifying strengths, weaknesses, and potential pitfalls before you write a single line of code.",
        icon: <IconBrain className="w-12 h-12 text-primary-red" />,
        gradient: "from-red-500/20 to-orange-500/5",
    },
    {
        title: "Market Intelligence",
        description: "Stop guessing. Get real-time data on market size (TAM/SAM/SOM), growth trends, and customer demographics to validate your opportunity.",
        icon: <IconChartBar className="w-12 h-12 text-blue-500" />,
        gradient: "from-blue-500/20 to-cyan-500/5",
    },
    {
        title: "Competitive Analysis",
        description: "The Spy agent maps your competitive landscape, revealing who your rivals are, their pricing strategies, and the gaps they've left open for you.",
        icon: <IconSpy className="w-12 h-12 text-purple-500" />,
        gradient: "from-purple-500/20 to-pink-500/5",
    },
    {
        title: "Financial Modeling",
        description: "The Financier agent builds robust financial projections, estimating your burn rate, runway, and path to profitability with scary accuracy.",
        icon: <IconZoomMoney className="w-12 h-12 text-green-500" />,
        gradient: "from-green-500/20 to-emerald-500/5",
    },
    {
        title: "Launch Architecture",
        description: "The Architect agent outlines your MVP tech stack, development roadmap, and go-to-market strategy, turning analysis into action.",
        icon: <IconRocket className="w-12 h-12 text-yellow-500" />,
        gradient: "from-yellow-500/20 to-amber-500/5",
    },
    {
        title: "Pixel JS",
        description: "Our proprietary tracking pixel collects early user intent data, feeding real-world signals back into our prediction engine for dynamic updates.",
        icon: <IconTargetArrow className="w-12 h-12 text-indigo-500" />,
        gradient: "from-indigo-500/20 to-violet-500/5",
    }
];

export default function FeaturesPage() {
    return (
        <PageWrapper>
            <div className="max-w-7xl mx-auto px-6 mb-24">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
                    >
                        Features that <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-red to-orange-600">empower</span> you.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                        className="text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed"
                    >
                        A complete ecosystem of AI agents working in unison to take you from raw idea to validated startup.
                    </motion.p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className={`group relative p-8 rounded-3xl border border-white/10 bg-black/20 backdrop-blur-xl overflow-hidden hover:border-white/20 transition-colors duration-300`}
                        >
                            {/* Gradient Background on Hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            <div className="relative z-10">
                                <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit border border-white/5 backdrop-blur-md group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all">
                                    {feature.title}
                                </h3>
                                <p className="text-neutral-400 leading-relaxed font-light">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </PageWrapper>
    );
}
