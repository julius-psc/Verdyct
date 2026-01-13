"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const t = useTranslations('FAQ');

  // Dynamically generate numeric keys based on known count (5 items: 0-4)
  const faqs = [0, 1, 2, 3, 4].map((index) => ({
    question: t(`items.${index}.question`),
    answer: t(`items.${index}.answer`)
  }));


  return (
    <section id="faq" className="py-24 px-6 bg-[#1B1818] border-t border-white/5">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            {t('title')}
          </h2>
          <p className="text-neutral-400">
            {t('subtitle')}
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
