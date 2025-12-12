'use client';

import PageWrapper from "@/app/components/landing/PageWrapper";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";

interface FAQItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
}

const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => {
    return (
        <motion.div
            initial={false}
            className={`border border-white/10 rounded-2xl bg-white/5 overflow-hidden transition-all duration-300 ${isOpen ? 'bg-white/10 border-white/20 shadow-lg' : 'hover:border-white/20'}`}
        >
            <button
                onClick={onClick}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
            >
                <span className="text-lg font-bold text-white">{question}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <IconChevronDown className="text-neutral-400" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="px-6 pb-6 text-neutral-300 leading-relaxed font-light">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const faqs = [
    {
        question: "How accurate is the Predictive Opportunity Score (POS)?",
        answer: "Our POS is calculated using a 7-dimensional scoring model analyzing market size, competition, trends, and more. While no prediction is 100% guaranteed, our backtesting shows a 85% correlation with real-world startup success rates."
    },
    {
        question: "Can I export the reports?",
        answer: "Yes! All reports (Analyst, Spy, Financier, Architect) can be exported as comprehensive PDF documents or raw JSON data for further analysis or presentation to investors."
    },
    {
        question: "What happens to my data? Is it safe?",
        answer: "We take IP protection seriously. Your ideas are encrypted at rest and in transit. We do not use your proprietary data to train our public models without your explicit consent."
    },
    {
        question: "Can I cancel my subscription anytime?",
        answer: "Absolutely. You can manage your subscription directly from the dashboard. If you cancel, you keep access until the end of your billing period."
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <PageWrapper>
            <div className="max-w-3xl mx-auto px-6 mb-24">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-5xl font-bold text-white mb-6"
                    >
                        Frequently Asked Questions
                    </motion.h1>
                    <p className="text-neutral-400">Everything you need to know about Verdyct.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <FAQItem
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={openIndex === index}
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </PageWrapper>
    );
}
