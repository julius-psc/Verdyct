'use client';

import PageWrapper from "@/app/[locale]/components/landing/PageWrapper";
import { motion } from "motion/react";
import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export default function LegalLayout({ children, title }: { children: React.ReactNode, title: string }) {
    const pathname = usePathname();
    const t = useTranslations('Legal.layout');

    const links = [
        { name: t('nav.privacy'), href: "/privacy" },
        { name: t('nav.terms'), href: "/terms" },
        { name: t('nav.security'), href: "/security" },
        { name: t('nav.cookies'), href: "/cookies" },
    ];

    return (
        <PageWrapper>
            <div className="max-w-6xl mx-auto px-6 mb-24 grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Sidebar Navigation for Legal */}
                <div className="md:col-span-1">
                    <div className="sticky top-32">
                        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-6">{t('title')}</h3>
                        <ul className="space-y-4">
                            {links.map((link) => {
                                // Simple check for active link, could be improved to handle locales in path
                                const isActive = pathname?.includes(link.href);
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
                    className="md:col-span-3 prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-neutral-400 prose-p:leading-relaxed prose-li:text-neutral-400 prose-strong:text-white prose-a:text-white prose-a:underline hover:prose-a:text-neutral-300 transition-colors"
                >
                    <h1 className="text-4xl font-bold text-white mb-12 tracking-tight">{title}</h1>
                    <div className="space-y-6">
                        {children}
                    </div>
                </motion.div>
            </div>
        </PageWrapper>
    );
}
