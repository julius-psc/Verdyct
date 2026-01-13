"use client"

import { IconStack2Filled, IconLink, IconArrowUp } from "@tabler/icons-react";
import { AudioLines } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { createClient } from "@/utils/supabase/client";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations('Hero');
  const [input, setInput] = useState("");
  const [analysisType, setAnalysisType] = useState<'small' | 'full'>('small');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkPendingIdea = async () => {
      const pendingIdea = localStorage.getItem('pending_idea');
      const pendingType = localStorage.getItem('pending_type');
      if (pendingIdea) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setInput(pendingIdea);
          if (pendingType) setAnalysisType(pendingType as 'small' | 'full');
          localStorage.removeItem('pending_idea');
          localStorage.removeItem('pending_type');
          handleSubmit(pendingIdea);
        }
      }
    };

    checkPendingIdea();
  }, []);

  const handleSubmit = async (promptOverride?: string) => {
    const promptToUse = promptOverride || input;
    if (!promptToUse.trim()) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        localStorage.setItem('pending_idea', promptToUse);
        localStorage.setItem('pending_type', analysisType);
        router.push('/login?next=/analyzing');
        return;
      }

      // If logged in, go straight to analyzing page
      router.push(`/analyzing?idea=${encodeURIComponent(promptToUse)}&type=${analysisType}`);

    } catch (error) {
      console.error("Error checking session:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center px-6 py-20"
      style={{
        backgroundImage: `url('/assets/illustrations/hero-bg.svg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Content Container */}
      <div className="max-w-3xl w-full flex flex-col items-center text-center space-y-6">

        {/* Beta Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-sm">
          <IconStack2Filled className="w-4 h-4 text-white/80" />
          <span className="text-sm font-medium text-white/80">{t('betaTag')}</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
          {t('heading')}
        </h1>

        {/* Subheading */}
        <p className="text-base md:text-xl text-white/70 max-w-2xl">
          {t('subheading')}
        </p>

        {/* Input Container */}
        <div className="w-full max-w-2xl">
          <div className="relative bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-4 flex flex-col gap-3">
            {/* Textarea */}
            <textarea
              placeholder={t('inputPlaceholder')}
              className="w-full bg-transparent text-white placeholder:text-white/40 resize-none outline-none text-base"
              rows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            {/* Analysis Type Toggle */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 px-2">
              <label className={`flex items-center gap-2 cursor-pointer transition-opacity ${analysisType === 'small' ? 'opacity-100' : 'opacity-50'}`}>
                <input
                  type="radio"
                  name="analysisType"
                  value="small"
                  checked={analysisType === 'small'}
                  onChange={(e) => setAnalysisType(e.target.value as 'small' | 'full')}
                  className="hidden"
                />
                <div className={`w-4 h-4 rounded-full border border-white/50 flex items-center justify-center ${analysisType === 'small' ? 'bg-white' : 'bg-transparent'}`}>
                  {analysisType === 'small' && <div className="w-2 h-2 rounded-full bg-black" />}
                </div>
                <span className="text-white text-sm font-medium">{t('smallAnalysis')}</span>
              </label>

              <label className={`flex items-center gap-2 cursor-pointer transition-opacity ${analysisType === 'full' ? 'opacity-100' : 'opacity-50'}`}>
                <input
                  type="radio"
                  name="analysisType"
                  value="full"
                  checked={analysisType === 'full'}
                  onChange={(e) => setAnalysisType(e.target.value as 'small' | 'full')}
                  className="hidden"
                />
                <div className={`w-4 h-4 rounded-full border border-white/50 flex items-center justify-center ${analysisType === 'full' ? 'bg-white' : 'bg-transparent'}`}>
                  {analysisType === 'full' && <div className="w-2 h-2 rounded-full bg-black" />}
                </div>
                <span className="text-white text-sm font-medium">{t('fullAnalysis')}</span>
              </label>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between relative z-20">
              {/* Left: Attach Button (Disabled) */}
              <button disabled className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/5 text-white/30 cursor-not-allowed group relative transition-colors">
                <IconLink className="w-4 h-4" />
                <span className="text-sm font-medium">{t('attach')}</span>
                {/* Tooltip */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-neutral-900 border border-white/10 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-50">
                  {t('comingSoon')}
                </div>
              </button>

              {/* Right: Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Audio Button (Disabled) */}
                <button disabled className="w-10 h-10 rounded-full bg-white/5 border border-white/5 text-white/30 flex items-center justify-center cursor-not-allowed group relative transition-colors">
                  <AudioLines className="w-5 h-5" />
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-neutral-900 border border-white/10 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-50">
                    {t('comingSoon')}
                  </div>
                </button>

                {/* Submit Button */}
                <button
                  onClick={() => handleSubmit()}
                  disabled={!input.trim()}
                  className="w-10 h-10 rounded-full bg-white hover:bg-white/90 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                >
                  <IconArrowUp className="w-5 h-5 text-black" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
