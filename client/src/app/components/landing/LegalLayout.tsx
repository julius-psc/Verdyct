'use client';

import PageWrapper from "@/app/components/landing/PageWrapper";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LegalLayout({ children, title }: { children: React.ReactNode, title: string }) {
    const pathname = usePathname();

    const links = [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Security", href: "/security" },
        { name: "Cookies", href: "/cookies" },
    ];

    return (
        <PageWrapper>
            <div className="max-w-6xl mx-auto px-6 mb-24 grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Sidebar Navigation for Legal */}
                <div className="md:col-span-1">
                    <div className="sticky top-32">
                        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-6">Legal</h3>
                        <ul className="space-y-4">
                            {links.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className={`text-sm font-medium transition-colors ${isActive ? 'text-white border-l-2 border-primary-red pl-4' : 'text-neutral-400 hover:text-white pl-4 border-l-2 border-transparent'}`}
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {/* Content Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="md:col-span-3 prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-neutral-200 prose-li:text-neutral-200 prose-strong:text-white prose-a:text-primary-red hover:prose-a:text-white transition-colors"
                >
                    <h1 className="text-5xl font-bold text-white mb-10">{title}</h1>
                    <div className="bg-neutral-900/80 rounded-3xl p-10 border border-white/10 backdrop-blur-md shadow-2xl text-white [&_p]:!text-white [&_li]:!text-white [&_h2]:!text-white [&_h3]:!text-white [&_strong]:!text-white">
                        {children}
                    </div>
                </motion.div>
            </div>
        </PageWrapper>
    );
}
