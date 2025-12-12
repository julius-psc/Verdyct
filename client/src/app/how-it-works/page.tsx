'use client';

import PageWrapper from "@/app/components/landing/PageWrapper";
import { motion } from "motion/react";
import { IconBulb, IconChartGridDots, IconReportAnalytics } from "@tabler/icons-react";

const steps = [
    {
        id: "01",
        title: "Submit Your Idea",
        description: "Describe your business concept in plain English. No business plan or pitch deck required. Just your raw idea.",
        icon: <IconBulb className="w-8 h-8 text-white" />,
        color: "bg-blue-500"
    },
    {
        id: "02",
        title: "Multi-Agent Analysis",
        description: "Our swarm of AI agents (Analyst, Spy, Financier, Architect) instantly goes to work, researching market data, competitors, and financials.",
        icon: <IconChartGridDots className="w-8 h-8 text-white" />,
        color: "bg-purple-500"
    },
    {
        id: "03",
        title: "Get Your Verdyct",
        description: "Receive a comprehensive report with a Predictive Opportunity Score (POS) and a complete roadmap to execution.",
        icon: <IconReportAnalytics className="w-8 h-8 text-white" />,
        color: "bg-primary-red"
    }
];

export default function HowItWorksPage() {
    return (
        <PageWrapper>
            <div className="max-w-6xl mx-auto px-6 mb-32">
                <div className="text-center mb-24">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
                    >
                        From idea to plan in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">seconds</span>.
                    </motion.h1>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-red/0 via-primary-red/50 to-primary-red/0 -translate-x-1/2" />

                    <div className="space-y-24">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.7 }}
                                className={`relative flex flex-col md:flex-row gap-8 items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                            >
                                {/* Content Side */}
                                <div className="flex-1 text-center md:text-left">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-4 ${index % 2 === 0 ? 'bg-gradient-to-r from-blue-500/20 to-transparent text-blue-400' : 'bg-gradient-to-r from-primary-red/20 to-transparent text-primary-red'}`}>
                                        Step {step.id}
                                    </div>
                                    <h3 className="text-4xl font-bold text-white mb-4">{step.title}</h3>
                                    <p className="text-lg text-neutral-400 leading-relaxed font-light">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Center Icon Node */}
                                <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-full bg-[#1B1818] border-4 border-[#1B1818] shadow-xl flex items-center justify-center">
                                    <div className={`w-full h-full rounded-full ${step.color} bg-opacity-20 flex items-center justify-center border border-white/20`}>
                                        {step.icon}
                                    </div>
                                </div>

                                {/* Spacer Side */}
                                <div className="flex-1 hidden md:block" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}
