'use client';

import PageWrapper from "@/app/components/landing/PageWrapper";
import { motion } from "motion/react";
import { IconBrandLinkedin, IconBrandTwitter, IconMail, IconMapPin } from "@tabler/icons-react";
import { useState } from "react";

export default function ContactPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('http://localhost:8000/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setStatus('success');
            } else {
                setStatus('idle');
                alert('Something went wrong. Please try again.');
            }
        } catch (e) {
            console.error(e);
            setStatus('idle');
            alert('Something went wrong. Please try again.');
        }
    }

    return (
        <PageWrapper>
            <div className="max-w-7xl mx-auto px-6 mb-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    {/* Info Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
                            Let&apos;s <span className="text-primary-red">talk</span>.
                        </h1>
                        <p className="text-xl text-neutral-400 mb-12 max-w-md leading-relaxed">
                            Have questions about specific features? Need a custom enterprise plan? We&apos;re here to help.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-primary-red">
                                    <IconMail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">Email</h3>
                                    <p className="text-neutral-400">hello@verdyct.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-primary-red">
                                    <IconMapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">Office</h3>
                                    <p className="text-neutral-400">123 Market St<br />San Francisco, CA 94103</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
                                <IconBrandTwitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
                                <IconBrandLinkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </motion.div>

                    {/* Form Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="bg-white/5 rounded-3xl p-10 border border-white/10 backdrop-blur-md"
                    >
                        {status === 'success' ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6 text-green-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                                <p className="text-neutral-400">We'll get back to you shortly.</p>
                            </div>
                        ) : (
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-400 mb-2">First Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.first_name}
                                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-red transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-400 mb-2">Last Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.last_name}
                                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-red transition-colors"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-400 mb-2">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-red transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-400 mb-2">Message</label>
                                    <textarea
                                        rows={4}
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-red transition-colors resize-none"
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full bg-primary-red text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </PageWrapper>
    );
}
