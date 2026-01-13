'use client';

import { CheckCircle, XCircle, Eye, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useState } from 'react';
import { useTranslations } from 'next-intl';


export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const t = useTranslations('Pricing');

  return (
    <section id="pricing" className="py-20 px-4 bg-[#1B1818]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">
            {t('title')}
          </h1>
          <p className="text-base text-neutral-300">
            {t('subtitle')}
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex justify-center mb-16">
          <div className="relative flex bg-neutral-800 p-1 rounded-full border border-neutral-700">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 ${!isAnnual ? 'bg-white text-black shadow-lg' : 'text-neutral-400 hover:text-white'
                }`}
            >
              {t('monthly')}
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-2 ${isAnnual ? 'bg-white text-black shadow-lg' : 'text-neutral-400 hover:text-white'
                }`}
            >
              {t('annual')}
              <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full border border-green-500/20">
                {t('save22')}
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Beginner Card */}
          <div className="bg-neutral-800/50 border border-neutral-700 rounded-3xl p-8 min-h-[600px] flex flex-col">
            <div className="text-base font-medium text-white mb-3">{t('plans.beginner.name')}</div>
            <div className="mb-3">
              <span className="text-4xl font-bold text-white">€0</span>
              <span className="text-sm text-neutral-400"> {t('perMonth')}</span>
            </div>
            <p className="text-sm text-neutral-300 mb-6">{t('plans.beginner.description')}</p>


            <button className="w-full bg-white text-black font-semibold rounded-lg py-3 text-sm hover:bg-neutral-200 transition-colors duration-200">
              {t('startFree')}
            </button>

            <div className="mt-8 flex-1">
              <p className="text-xs text-neutral-400 mb-3">{t('plans.beginner.includesLabel')}</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span className="text-xs text-neutral-300">{t('plans.beginner.features.0')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span className="text-xs text-neutral-300">{t('plans.beginner.features.1')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-neutral-600 shrink-0" />
                  <span className="text-xs text-neutral-600">{t('plans.beginner.features.2')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-neutral-600 shrink-0" />
                  <span className="text-xs text-neutral-600">{t('plans.beginner.features.3')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-neutral-600 shrink-0" />
                  <span className="text-xs text-neutral-600">{t('plans.beginner.features.4')}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Starter Card - HIGHLIGHTED */}
          <div className="bg-neutral-800/50 border border-primary-red/50 rounded-3xl p-8 min-h-[600px] flex flex-col relative overflow-hidden ring-1 ring-primary-red/20 shadow-2xl shadow-primary-red/5">
            {/* Launch Ribbon */}
            <div className="absolute top-5 right-5 px-3 py-1 bg-primary-red/20 text-primary-red text-xs font-bold rounded-full border border-primary-red/20">
              {t('launchOffer')}
            </div>

            <div className="flex flex-col items-start gap-1 mb-3">
              <div className="text-base font-medium text-white">{t('plans.starter.name')}</div>
              <div className="px-2.5 py-0.5 bg-neutral-800 rounded-full text-xs text-white border border-white/10">
                {t('launchDate')}
              </div>
            </div>
            <div className="mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">€9</span>
                <span className="text-lg text-neutral-500 line-through">€19</span>
              </div>
              <span className="text-sm text-neutral-400"> {t('perPack')}</span>
            </div>
            <p className="text-sm text-neutral-300 mb-6">{t('plans.starter.description')}</p>

            <Link href="/examples/analysis" className="flex items-center justify-center gap-2 w-full py-2 mb-3 rounded-lg border border-neutral-700 hover:border-red-500/50 hover:bg-red-500/5 text-xs font-medium text-neutral-300 hover:text-red-400 transition-all group">
              <Eye className="w-3 h-3 group-hover:scale-110 transition-transform" />
              {t('seeAnalysis')}
            </Link>

            <Link href="/waitlist" className="w-full bg-primary-red text-white font-semibold rounded-lg py-3 text-sm hover:bg-red-600 transition-colors duration-200 text-center">
              {t('joinWaitlist')}
            </Link>

            <div className="mt-8 flex-1">
              <p className="text-xs text-neutral-400 mb-3">{t('plans.starter.includesLabel')}</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-white shrink-0" />
                  <span className="text-xs text-white">{t('plans.starter.features.0')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-white shrink-0" />
                  <span className="text-xs text-white">{t('plans.starter.features.1')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-white shrink-0" />
                  <span className="text-xs text-white">{t('plans.starter.features.2')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-white shrink-0" />
                  <span className="text-xs text-white">{t('plans.starter.features.3')}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Builder Card */}
          <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-3xl p-8 min-h-[600px] flex flex-col relative overflow-hidden">
            {/* Launch Ribbon */}
            <div className="absolute top-5 right-5 px-3 py-1 bg-neutral-800 text-neutral-400 text-xs font-bold rounded-full border border-neutral-700">
              {t('launchOffer')}
            </div>

            <div className="flex flex-col items-start gap-1 mb-3">
              <div className="text-base font-medium text-white">{t('plans.builder.name')}</div>
              <div className="px-2.5 py-0.5 bg-neutral-800 rounded-full text-xs text-white border border-white/10">
                {t('launchDate')}
              </div>
            </div>
            <div className="mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white transition-all key={isAnnual ? 'annual' : 'monthly'}">
                  {isAnnual ? '€270' : '€19'}
                </span>
                <span className="text-lg text-neutral-500 line-through">
                  {isAnnual ? '€348' : '€29'}
                </span>
              </div>
              <span className="text-sm text-neutral-400"> {isAnnual ? t('perYear') : t('perMonth')}</span>
            </div>
            <p className="text-sm text-neutral-300 mb-6">{t('plans.builder.description')}</p>

            <Link href="/examples/timeline" className="flex items-center justify-center gap-2 w-full py-2 mb-3 rounded-lg border border-neutral-700 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-xs font-medium text-neutral-300 hover:text-emerald-400 transition-all group">
              <Sparkles className="w-3 h-3 group-hover:rotate-12 transition-transform" />
              {t('seeRoadmap')}
            </Link>

            <Link href="/waitlist" className="w-full bg-neutral-800 text-white font-semibold rounded-lg py-3 text-sm border border-neutral-700 hover:bg-neutral-700 transition-colors duration-200 text-center">
              {isAnnual ? t('joinWaitlistAnnual') : t('joinWaitlist')}
            </Link>

            <div className="mt-8 flex-1">
              <p className="text-xs text-neutral-400 mb-3">{t('plans.builder.includesLabel')}</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span className="text-xs text-neutral-300">{t('plans.builder.features.0')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span className="text-xs text-neutral-300">{t('plans.builder.features.1')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span className="text-xs text-neutral-300">{t('plans.builder.features.2')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span className="text-xs text-neutral-300">{t('plans.builder.features.3')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

