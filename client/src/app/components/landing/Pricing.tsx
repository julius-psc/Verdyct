'use client';

import { CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">
            Pricing that scales with you
          </h1>
          <p className="text-base text-neutral-300 mb-6">
            We promise you&apos;ll get your money&apos;s worth.
          </p>

          {/* Annual/Monthly Toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-neutral-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                isAnnual ? 'bg-primary-red' : 'bg-neutral-700'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                  isAnnual ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-white' : 'text-neutral-400'}`}>
              Annual <span className="text-green-400">(Save 20%)</span>
            </span>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Free Card */}
          <div className="bg-neutral-800/50 border border-neutral-700 rounded-3xl p-8 min-h-[600px] flex flex-col">
            <div className="text-base font-medium text-white mb-3">Free</div>
            <div className="mb-3">
              <span className="text-4xl font-bold text-white">$0</span>
              <span className="text-sm text-neutral-400"> / month</span>
            </div>
            <p className="text-sm text-neutral-300 mb-6">Perfect for individual users</p>

            <button className="w-full bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-full py-3 text-sm hover:bg-neutral-700 transition-colors duration-200">
              Start Free
            </button>

            <div className="mt-8 flex-1">
              <p className="text-xs text-neutral-400 mb-3">Everything in Free</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span className="text-xs text-neutral-300">1 Complete Verdyct Report</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span className="text-xs text-neutral-300">Access to Analyst Agent (Market)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span className="text-xs text-neutral-300">Access to Spy Agent (Competitors)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span className="text-xs text-neutral-300">Access to Financier Agent (Potential)</span>
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-neutral-600 shrink-0" />
                  <span className="text-xs text-neutral-600">Access to Architect Agent (MVP)</span>
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-neutral-600 shrink-0" />
                  <span className="text-xs text-neutral-600">No access to Prediction Pixel</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Startup Card - HIGHLIGHTED */}
          <div className="bg-neutral-800/50 border-2 border-primary-red rounded-3xl p-8 min-h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <div className="text-base font-medium text-white">Startup</div>
              <div className="px-2.5 py-0.5 bg-primary-red rounded-full text-xs text-white">
                Popular
              </div>
            </div>
            <div className="mb-3">
              <span className="text-4xl font-bold text-white">
                ${isAnnual ? '15' : '19'}
              </span>
              <span className="text-sm text-neutral-400"> / month</span>
              {isAnnual && (
                <div className="text-xs text-neutral-400 mt-1">
                  Billed annually (${15 * 12}/year)
                </div>
              )}
            </div>
            <p className="text-sm text-neutral-300 mb-6">Perfect for aspiring founders</p>

            <button
              className="w-full bg-primary-red text-white rounded-full py-3 text-sm hover:opacity-90 transition-all duration-200 hover:scale-105"
            >
              Upgrade to Pro
            </button>

            <div className="mt-8 flex-1">
              <p className="text-xs text-neutral-400 mb-3">Everything in Free, plus...</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-white shrink-0" />
                  <span className="text-xs text-white">10 Verdyct Reports per month</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-white shrink-0" />
                  <span className="text-xs text-white">Access to all Agents (Analyst, Spy, Financier)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-white shrink-0" />
                  <span className="text-xs text-white">Priority access to Architect Agent (MVP)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-white shrink-0" />
                  <span className="text-xs text-white">Prediction Pixel activation (Data Moat)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-white shrink-0" />
                  <span className="text-xs text-white">MVP / Landing Page code export</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Enterprise Card */}
          <div className="bg-neutral-800/50 border border-neutral-700 rounded-3xl p-8 min-h-[600px] flex flex-col">
            <div className="text-base font-medium text-white mb-3">Enterprise</div>

            <button className="w-full bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-full py-3 mb-3 text-sm hover:bg-neutral-700 transition-colors duration-200">
              Contact Us
            </button>

            <p className="text-sm text-neutral-300 mb-6">Perfect for large-scale enterprises</p>

            <div className="mt-8 flex-1">
              <p className="text-xs text-neutral-400 mb-3">Everything in Pro, plus...</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span className="text-xs text-neutral-300">API access for integration</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span className="text-xs text-neutral-300">White-label reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span className="text-xs text-neutral-300">Dedicated priority support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
