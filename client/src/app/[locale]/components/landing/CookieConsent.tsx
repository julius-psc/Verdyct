'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslations } from 'next-intl';
import posthog from 'posthog-js';

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);
    const t = useTranslations('CookieConsent');

    useEffect(() => {
        // Check local storage on mount
        const consent = localStorage.getItem('verdyct_cookie_consent');
        if (!consent) {
            // Delay slightly for smoother entrance
            setTimeout(() => setIsVisible(true), 1000);
        } else if (consent === 'accepted') {
            // Ensure PostHog is opted in if previously accepted
            posthog.opt_in_capturing();
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('verdyct_cookie_consent', 'accepted');
        posthog.opt_in_capturing(); // Enable PostHog
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('verdyct_cookie_consent', 'declined');
        posthog.opt_out_capturing(); // Disable PostHog
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="fixed bottom-0 left-0 right-0 z-[100] p-4 flex justify-center pointer-events-none"
                >
                    <div className="bg-[#1B1818]/90 backdrop-blur-md border border-white/10 p-4 md:p-5 rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col md:flex-row items-center gap-4 md:gap-8 pointer-events-auto">
                        <p className="text-neutral-300 text-sm text-center md:text-left flex-grow">
                            {t('text')}
                        </p>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={handleDecline}
                                className="flex-1 md:flex-none px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors"
                            >
                                {t('decline')}
                            </button>
                            <button
                                onClick={handleAccept}
                                className="flex-1 md:flex-none px-6 py-2 bg-white text-black font-medium text-sm rounded-full hover:bg-neutral-200 transition-colors shadow-lg"
                            >
                                {t('accept')}
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
