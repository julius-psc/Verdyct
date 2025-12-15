"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";

const faqs = [
  {
    question: "Do I need a business plan?",
    answer: "Not at all. Just describe your idea in plain English. Our AI agents will extrapolate the necessary details to build a comprehensive analysis.",
  },
  {
    question: "How accurate are the predictions?",
    answer: "Our predictions are based on real-time market data, competitor analysis, and financial modeling. While no prediction is 100% guaranteed, we provide data-backed probabilities to guide your decisions.",
  },
  {
    question: "Can I download the reports?",
    answer: "Yes! You can export the full analysis, including the business plan, financial models, and competitor research, as a professional PDF report.",
  },
  {
    question: "What if my idea changes?",
    answer: "No problem. You can pivot your idea within the platform. Our Architect Agent will help you adjust your strategy and re-run numbers instantly.",
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. Your ideas are your intellectual property. We use enterprise-grade encryption and never share your data with third parties or use it to train public models.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 px-6 bg-[#1B1818] border-t border-white/5">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-neutral-400">
            Everything you need to know about Verdyct.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${openIndex === index
                  ? 'bg-white/5 border-white/10 shadow-lg'
                  : 'bg-transparent border-transparent hover:bg-white/5'
                }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
              >
                <span className={`text-lg font-medium transition-colors ${openIndex === index ? 'text-white' : 'text-neutral-400 group-hover:text-white'}`}>
                  {faq.question}
                </span>
                <span className={`p-2 rounded-full transition-all duration-300 ${openIndex === index ? 'bg-primary-red/10 text-primary-red rotate-180' : 'text-neutral-500 bg-white/5 group-hover:bg-white/10'}`}>
                  <IconChevronDown className="w-5 h-5" />
                </span>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-neutral-400 leading-relaxed border-t border-white/5 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
