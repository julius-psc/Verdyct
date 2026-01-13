'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { IconLanguage } from '@tabler/icons-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Note: we're using motion/react as per Navbar.tsx usage

    const changeLanguage = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 text-white/70 hover:text-white transition-colors p-2"
                aria-label="Change language"
            >
                <IconLanguage className="w-5 h-5" />
                <span className="text-sm font-medium uppercase">{locale}</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-32 bg-[#1B1818] border border-neutral-800 rounded-xl shadow-xl overflow-hidden py-1 z-50 text-white"
                    >
                        <button
                            onClick={() => changeLanguage('en')}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors ${locale === 'en' ? 'text-emerald-400 font-bold' : 'text-neutral-300'}`}
                        >
                            English
                        </button>
                        <button
                            onClick={() => changeLanguage('fr')}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors ${locale === 'fr' ? 'text-emerald-400 font-bold' : 'text-neutral-300'}`}
                        >
                            Français
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
