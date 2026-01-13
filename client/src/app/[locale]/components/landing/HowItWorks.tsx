"use client";

import { motion } from "motion/react";
import { IconBulb, IconCpu, IconFileAnalytics } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export default function HowItWorks() {
    const t = useTranslations('HowItWorks');

    const steps = [
        {
            id: "01",
            title: t('steps.01.title'),
            description: t('steps.01.description'),
            icon: <IconBulb className="w-6 h-6" />,
        },
        {
            id: "02",
            title: t('steps.02.title'),
            description: t('steps.02.description'),
            icon: <IconCpu className="w-6 h-6" />,
        },
        {
            id: "03",
            title: t('steps.03.title'),
            description: t('steps.03.description'),
            icon: <IconFileAnalytics className="w-6 h-6" />,
        }
    ];

    return (
        <section id="how-it-works" className="py-24 px-6 bg-[#1B1818] border-t border-white/5">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-xl">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-4xl font-bold text-white mb-4 tracking-tight"
                        >
                            {t('title')}
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-lg text-neutral-400 font-light"
                        >
                            {t('subtitle')}
                        </motion.p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting line for desktop */}
                    <div className="hidden md:block absolute top-[2.25rem] left-[10%] w-[80%] h-0.5 bg-neutral-800 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.15)_50%,transparent_50%)] bg-[length:12px_100%]" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative group pt-4"
                        >
                            <div className="mb-6 flex items-center gap-4">
                                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-900 border border-white/10 text-white group-hover:border-primary-red/50 group-hover:text-primary-red transition-colors duration-300 z-10 relative">
                                    <span className="font-mono text-sm">{step.id}</span>
                                </div>
                                <div className="h-px bg-white/10 flex-grow md:hidden" />
                            </div>

                            <div className="space-y-4 pr-4">
                                <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 mb-4 text-neutral-300 group-hover:text-white transition-colors">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-white">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-neutral-400 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
