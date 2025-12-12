'use client';

import PageWrapper from "@/app/components/landing/PageWrapper";
import { motion } from "motion/react";
import { IconBrandLinkedin, IconBrandTwitter, IconMail, IconMapPin } from "@tabler/icons-react";

export default function ContactPage() {
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
                        <form className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-400 mb-2">First Name</label>
                                    <input type="text" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-red transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-400 mb-2">Last Name</label>
                                    <input type="text" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-red transition-colors" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-2">Email</label>
                                <input type="email" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-red transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-2">Message</label>
                                <textarea rows={4} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-red transition-colors resize-none"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-primary-red text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                                Send Message
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </PageWrapper>
    );
}
