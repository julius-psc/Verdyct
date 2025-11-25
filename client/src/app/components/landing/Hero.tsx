"use client"

import heroBg from "../../../../public/assets/illustrations/hero-bg.png";
import { IconStack2Filled, IconLink, IconArrowUp } from "@tabler/icons-react";
import { AudioLines } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingModal from "../temporary/LoadingModal";
import EnhancePivot from "../temporary/EnhancePivot";

type FlowState = 'idle' | 'analyzing' | 'decision' | 'building' | 'completed';

export default function Hero() {
  const [input, setInput] = useState("");
  const [flowState, setFlowState] = useState<FlowState>('idle');
  const router = useRouter();

  const handleSubmit = () => {
    if (!input.trim()) return;
    setFlowState('analyzing');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleAnalystComplete = () => {
    setFlowState('decision');
  };

  const handleDecisionAction = () => {
    // Whether enhance or pivot, we proceed to build
    setFlowState('building');
  };

  const handleRetry = () => {
    setFlowState('idle');
    setInput("");
  };

  const handleBuildComplete = () => {
    router.push('/dashboard');
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center px-6 py-20"
      style={{
        backgroundImage: `url(${heroBg.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Flow Components */}
      {flowState === 'analyzing' && (
        <LoadingModal
          stopAfterStep={0}
          onComplete={handleAnalystComplete}
        />
      )}

      {flowState === 'decision' && (
        <EnhancePivot
          score={58} // Demo score for "Pivot/Enhance" state
          onEnhance={handleDecisionAction}
          onPivot={handleDecisionAction}
          onRetry={handleRetry}
          onProceed={handleDecisionAction}
        />
      )}

      {flowState === 'building' && (
        <LoadingModal
          initialStep={1}
          onComplete={handleBuildComplete}
        />
      )}

      {/* Content Container */}
      <div className="max-w-3xl w-full flex flex-col items-center text-center space-y-6">

        {/* Beta Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-sm">
          <IconStack2Filled className="w-4 h-4 text-white/80" />
          <span className="text-sm font-medium text-white/80">Beta v1.0 is out!</span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
          We know what works.
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-white/70 max-w-2xl">
          Stop building what nobody wants. We predict your idea&apos;s success and give you the plan to launch.
        </p>

        {/* Input Container */}
        <div className="w-full max-w-2xl">
          <div className="relative bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-4 flex flex-col gap-3">
            {/* Textarea */}
            <textarea
              placeholder="Describe your idea..."
              className="w-full bg-transparent text-white placeholder:text-white/40 resize-none outline-none text-base"
              rows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            {/* Bottom Controls */}
            <div className="flex items-center justify-between">
              {/* Left: Attach Button */}
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-transparent hover:bg-white/5 transition-colors">
                <IconLink className="w-4 h-4 text-white/70" />
                <span className="text-sm font-medium text-white/70">Attach</span>
              </button>

              {/* Right: Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Audio Button */}
                <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center transition-colors">
                  <AudioLines className="w-5 h-5 text-white/70" />
                </button>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
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
