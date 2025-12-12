'use client';

import PageWrapper from "@/app/components/landing/PageWrapper";
import { motion } from "motion/react";
import Link from "next/link";
import { IconCookie, IconFileDescription, IconLock, IconShieldLock } from "@tabler/icons-react";

const legalParams = [
    { name: "Privacy Policy", href: "/privacy", icon: <IconShieldLock className="w-8 h-8 text-primary-red" />, desc: "How we process and protect your personal data." },
    { name: "Terms of Service", href: "/terms", icon: <IconFileDescription className="w-8 h-8 text-blue-500" />, desc: "The agreement between you and Verdyct." },
    { name: "Security", href: "/security", icon: <IconLock className="w-8 h-8 text-green-500" />, desc: "Our security standards and practices." },
    { name: "Cookie Policy", href: "/cookies", icon: <IconCookie className="w-8 h-8 text-orange-500" />, desc: "How we use cookies and tracking technologies." },
];

export default function LegalPage() {
    return (
        <PageWrapper>
            <div className="max-w-7xl mx-auto px-6 mb-32">
                <div className="text-center mb-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-5xl md:text-7xl font-bold text-white mb-6"
                    >
                        Legal <span className="text-neutral-500">Center</span>
                    </motion.h1>
                    <p className="text-xl text-neutral-400">Transparnecy is core to our values.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {legalParams.map((item, index) => (
                        <Link key={index} href={item.href}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1 h-full"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary-red transition-colors">{item.name}</h3>
                                <p className="text-neutral-400">{item.desc}</p>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </PageWrapper>
    );
}
