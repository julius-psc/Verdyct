'use client';

import PageWrapper from "@/app/[locale]/components/landing/PageWrapper";
import { motion } from "motion/react";
import { Link } from "@/i18n/routing";
import { IconCookie, IconFileDescription, IconLock, IconShieldLock, IconScale } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export default function LegalPage() {
    const t = useTranslations('Legal.hub');

    const legalParams = [
        { name: t('cards.privacy.name'), href: "/privacy", icon: <IconShieldLock className="w-8 h-8 text-primary-red" />, desc: t('cards.privacy.desc') },
        { name: t('cards.terms.name'), href: "/terms", icon: <IconFileDescription className="w-8 h-8 text-blue-500" />, desc: t('cards.terms.desc') },
        { name: t('cards.security.name'), href: "/security", icon: <IconLock className="w-8 h-8 text-green-500" />, desc: t('cards.security.desc') },
        { name: t('cards.cookies.name'), href: "/cookies", icon: <IconCookie className="w-8 h-8 text-orange-500" />, desc: t('cards.cookies.desc') },
        { name: "Mentions Légales", href: "/mentions-legales", icon: <IconScale className="w-8 h-8 text-purple-500" />, desc: "Informations légales obligatoires (L.C.E.N.)" },
    ];

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
                        {t('title')} <span className="text-neutral-500">{t('titleSpan')}</span>
                    </motion.h1>
                    <p className="text-xl text-neutral-400">{t('subtitle')}</p>
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
