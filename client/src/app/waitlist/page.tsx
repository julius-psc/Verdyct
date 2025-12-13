'use client';

import PageWrapper from "@/app/components/landing/PageWrapper";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { IconMail, IconCheck, IconArrowRight, IconSparkles } from "@tabler/icons-react";
import confetti from 'canvas-confetti';

export default function WaitlistPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");

        try {
            const res = await fetch('http://localhost:8000/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (res.ok) {
                setStatus("success");
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            } else {
                // Even if fails, we might show success to user or just silently fail in this mock-ish stage
                // But better to at least check
                console.error("Failed to join waitlist");
                setStatus("idle"); // reset or show error state 
            }
        } catch (err) {
            console.error(err);
            setStatus("idle");
        }
    };

    return (
        <PageWrapper>
            <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-red/10 rounded-full blur-[100px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 max-w-xl w-full text-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary-red text-sm font-medium mb-8">
                        <IconSparkles className="w-4 h-4" />
                        <span>Launching February 1st</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                        Join the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                            Revolution.
                        </span>
                    </h1>

                    <p className="text-xl text-neutral-400 mb-12">
                        Get 50% off for life when we launch. <br />
                        Be the first to know when spots open.
                    </p>

                    <AnimatePresence mode="wait">
                        {status === 'success' ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-green-500/10 border border-green-500/20 text-green-400 p-6 rounded-2xl flex flex-col items-center gap-3"
                            >
                                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                                    <IconCheck className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-white">You're on the list!</h3>
                                <p className="text-sm opacity-80">We'll notify you as soon as we're ready.</p>
                            </motion.div>
                        ) : (
                            <motion.form
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, y: -20 }}
                                onSubmit={handleSubmit}
                                className="relative max-w-md mx-auto"
                            >
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-600 rounded-full opacity-30 group-hover:opacity-50 blur transition duration-200" />
                                    <div className="relative flex items-center bg-[#1B1818] rounded-full p-1.5 border border-neutral-800">
                                        <div className="pl-4 text-neutral-500">
                                            <IconMail className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email address..."
                                            className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-neutral-500 px-3 py-2"
                                            required
                                            disabled={status === 'loading'}
                                        />
                                        <button
                                            type="submit"
                                            disabled={status === 'loading'}
                                            className="bg-primary-red hover:bg-red-600 text-white px-6 py-2.5 rounded-full font-medium transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {status === 'loading' ? 'Joining...' : 'Join Now'}
                                            {!status && <IconArrowRight className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <p className="text-xs text-neutral-500 mt-4">
                                    No spam. Unsubscribe anytime.
                                </p>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </PageWrapper>
    );
}
