'use client';

import PageWrapper from "@/app/[locale]/components/landing/PageWrapper";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { IconMail, IconCheck, IconArrowRight, IconLoader2 } from "@tabler/icons-react";
import confetti from 'canvas-confetti';

export default function WaitlistPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");
        setErrorMessage("");

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

        try {
            const res = await fetch(`${apiUrl}/api/waitlist`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (res.ok) {
                setStatus("success");
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#EF4444', '#ffffff']
                });
            } else {
                const errorData = await res.json().catch(() => ({}));
                console.error("Failed to join waitlist", errorData);
                setStatus("error");
                setErrorMessage(errorData.detail || "Something went wrong. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setStatus("error");
            setErrorMessage(`Connection failed to ${apiUrl}.`);
        }
    };

    return (
        <PageWrapper>
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 relative overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 max-w-lg w-full text-center"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-white mb-8">
                        <span className="w-2 h-2 rounded-full bg-primary-red animate-pulse" />
                        Access opening soon
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        Get early access.
                    </h1>

                    <p className="text-xl text-neutral-400 mb-12 font-light leading-relaxed">
                        Join the waitlist to secure your spot and lock in <span className="text-white font-medium">50% off for life.</span>
                    </p>

                    <AnimatePresence mode="wait">
                        {status === 'success' ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-[#1B1818] border border-white/10 p-8 rounded-2xl flex flex-col items-center gap-4 shadow-2xl"
                            >
                                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/10">
                                    <IconCheck className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">You're on the list.</h3>
                                    <p className="text-neutral-400 text-sm">We'll be in touch soon.</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.form
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, y: -10 }}
                                onSubmit={handleSubmit}
                                className="w-full max-w-md mx-auto space-y-4"
                            >
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <IconMail className="w-5 h-5 text-neutral-500" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@company.com"
                                        className="w-full bg-[#1B1818] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-neutral-500 focus:outline-none focus:border-white/20 transition-colors"
                                        required
                                        disabled={status === 'loading'}
                                    />
                                </div>
                                {status === 'error' && (
                                    <p className="text-red-400 text-sm text-center">{errorMessage}</p>
                                )}
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full bg-white text-black font-bold h-14 rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    {status === 'loading' ? (
                                        <IconLoader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            Join Waitlist <IconArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                                <p className="text-xs text-neutral-500 text-center">
                                    Strictly no spam. Unsubscribe at any time.
                                </p>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </PageWrapper>
    );
}
