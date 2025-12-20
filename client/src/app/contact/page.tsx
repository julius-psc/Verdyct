'use client';

import PageWrapper from "@/app/components/landing/PageWrapper";
import { motion } from "motion/react";
import { IconMail, IconBrandTwitter, IconMapPin } from "@tabler/icons-react";

export default function ContactPage() {
    return (
        <PageWrapper>
            <div className="max-w-4xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-5xl font-bold text-white mb-8">Get in touch</h1>
                        <p className="text-lg text-neutral-400 mb-12 leading-relaxed">
                            Have a question about Verdyct? Interested in a partnership? Or just want to say hello? we are all ears.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 text-white">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                    <IconMail className="w-5 h-5 text-neutral-300" />
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Email</p>
                                    <a href="mailto:hello@verdyct.io" className="text-lg hover:text-primary-red transition-colors">hello@verdyct.io</a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-white">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                    <IconBrandTwitter className="w-5 h-5 text-neutral-300" />
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Twitter</p>
                                    <a href="https://twitter.com/verdyct" target="_blank" rel="noopener noreferrer" className="text-lg hover:text-primary-red transition-colors">@verdyct</a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-white">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                    <IconMapPin className="w-5 h-5 text-neutral-300" />
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold">HQ</p>
                                    <span className="text-lg text-neutral-300">Caen, France</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-[#1B1818] p-8 rounded-3xl border border-white/5"
                    >
                        <form className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Name</label>
                                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-red/50 transition-colors" placeholder="Jane Doe" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Email</label>
                                <input type="email" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-red/50 transition-colors" placeholder="jane@example.com" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Message</label>
                                <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-red/50 transition-colors" placeholder="How can we help?" />
                            </div>
                            <button type="button" className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-neutral-200 transition-colors">
                                Send Message
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </PageWrapper>
    );
}
