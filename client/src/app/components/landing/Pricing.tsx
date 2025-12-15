'use client';

import { CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';


export default function Pricing() {

  return (
    <section id="pricing" className="py-20 px-4 bg-[#1B1818]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-3">
            Pricing that scales with you
          </h1>
          <p className="text-base text-neutral-300">
            We promise you&apos;ll get your money&apos;s worth.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Beginner Card */}
          <div className="bg-neutral-800/50 border border-neutral-700 rounded-3xl p-8 min-h-[600px] flex flex-col">
            <div className="text-base font-medium text-white mb-3">Beginner</div>
            <div className="mb-3">
              <span className="text-4xl font-bold text-white">€0</span>
              <span className="text-sm text-neutral-400"> / month</span>
            </div>
            <p className="text-sm text-neutral-300 mb-6">Perfect to get a taste</p>


            <button className="w-full bg-white text-black font-semibold rounded-lg py-3 text-sm hover:bg-neutral-200 transition-colors duration-200">
              Start Free
            </button>

            <div className="mt-8 flex-1">
              <p className="text-xs text-neutral-400 mb-3">Includes</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span className="text-xs text-neutral-300">1 Complete Verdyct Analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span className="text-xs text-neutral-300">Analyst Agent Access (Rapport)</span>
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-neutral-600 shrink-0" />
                  <span className="text-xs text-neutral-600">No Spy Agent (Competitors)</span>
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-neutral-600 shrink-0" />
                  <span className="text-xs text-neutral-600">No Financier Agent</span>
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-neutral-600 shrink-0" />
                  <span className="text-xs text-neutral-600">No Architect Agent</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Starter Card - HIGHLIGHTED */}
          <div className="bg-neutral-800/50 border border-primary-red/50 rounded-3xl p-8 min-h-[600px] flex flex-col relative overflow-hidden ring-1 ring-primary-red/20 shadow-2xl shadow-primary-red/5">
            {/* Launch Ribbon */}
            <div className="absolute top-5 right-5 px-3 py-1 bg-primary-red/20 text-primary-red text-xs font-bold rounded-full border border-primary-red/20">
              50% Launch Offer
            </div>

            <div className="flex flex-col items-start gap-1 mb-3">
              <div className="text-base font-medium text-white">Starter</div>
              <div className="px-2.5 py-0.5 bg-neutral-800 rounded-full text-xs text-white border border-white/10">
                Launch Feb 1st
              </div>
            </div>
            <div className="mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">€9</span>
                <span className="text-lg text-neutral-500 line-through">€19</span>
              </div>
              <span className="text-sm text-neutral-400"> / one-time</span>
            </div>
            <p className="text-sm text-neutral-300 mb-6">Deep dive into 5 ideas</p>

            <Link href="/waitlist" className="w-full bg-primary-red text-white font-semibold rounded-lg py-3 text-sm hover:bg-red-600 transition-colors duration-200 text-center">
              Join Waitlist
            </Link>

            <div className="mt-8 flex-1">
              <p className="text-xs text-neutral-400 mb-3">Everything in Beginner, plus...</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-white shrink-0" />
                  <span className="text-xs text-white">5 Full Verdyct Analyses</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-white shrink-0" />
                  <span className="text-xs text-white">Access to All 4 Agents</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-white shrink-0" />
                  <span className="text-xs text-white">Analyst, Spy, Financier, Architect</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-white shrink-0" />
                  <span className="text-xs text-white">Full Report Download</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Startup Card */}
          <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-3xl p-8 min-h-[600px] flex flex-col relative overflow-hidden">
            {/* Launch Ribbon */}
            <div className="absolute top-5 right-5 px-3 py-1 bg-neutral-800 text-neutral-400 text-xs font-bold rounded-full border border-neutral-700">
              50% Launch Offer
            </div>

            <div className="flex flex-col items-start gap-1 mb-3">
              <div className="text-base font-medium text-white">Startup</div>
              <div className="px-2.5 py-0.5 bg-neutral-800 rounded-full text-xs text-white border border-white/10">
                Launch Feb 1st
              </div>
            </div>
            <div className="mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">€19</span>
                <span className="text-lg text-neutral-500 line-through">€39</span>
              </div>
              <span className="text-sm text-neutral-400"> / month</span>
            </div>
            <p className="text-sm text-neutral-300 mb-6">For serious founders</p>

            <Link href="/waitlist" className="w-full bg-neutral-800 text-white font-semibold rounded-lg py-3 text-sm border border-neutral-700 hover:bg-neutral-700 transition-colors duration-200 text-center">
              Join Waitlist
            </Link>

            <div className="mt-8 flex-1">
              <p className="text-xs text-neutral-400 mb-3">Everything in Starter, plus...</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span className="text-xs text-neutral-300">20 Full Analyses / month</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span className="text-xs text-neutral-300">Competition Tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span className="text-xs text-neutral-300">Website Monitoring</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span className="text-xs text-neutral-300">VC Visibility</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

