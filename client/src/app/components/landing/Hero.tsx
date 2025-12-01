"use client"

import heroBg from "../../../../public/assets/illustrations/hero-bg.png";
import { IconStack2Filled, IconLink, IconArrowUp } from "@tabler/icons-react";
import { AudioLines } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";
import LoadingModal from "../temporary/LoadingModal";
import EnhancePivot from "../temporary/EnhancePivot";

type FlowState = 'idle' | 'analyzing' | 'decision' | 'building' | 'completed';

export default function Hero() {
  const [input, setInput] = useState("");
  const [flowState, setFlowState] = useState<FlowState>('idle');
  const [analysisData, setAnalysisData] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (promptOverride?: string) => {
    const promptToUse = promptOverride || input;
    if (!promptToUse.trim()) return;

    // If it's a retry/enhance/pivot, update the input to reflect what's being analyzed
    if (promptOverride) {
      setInput(promptOverride);
    }

    setAnalysisData(null);
    setFlowState('analyzing');

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      const response = await fetch('http://localhost:8000/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ idea: promptToUse }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No reader available');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              console.log("Stream event:", data);

              if (data.type === 'agent_complete') {
                window.dispatchEvent(new CustomEvent('agent-complete', { detail: data.agent }));
              } else if (data.type === 'complete') {
                setAnalysisData(data.data);
              } else if (data.type === 'error') {
                console.error("Stream error:", data.message);
              }
            } catch (e) {
              console.error("Error parsing stream data:", e);
            }
          }
        }
      }

    } catch (error) {
      console.error("Error analyzing idea:", error);
      setFlowState('idle');
      alert("Something went wrong. Please try again.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleAnalystComplete = () => {
    console.log("handleAnalystComplete called. Analysis Data:", analysisData);
    if (analysisData) {
      if (analysisData.status === 'approved') {
        router.push(`/${analysisData.project_id}/analyst`);
      } else {
        setFlowState('decision');
      }
    } else {
      setFlowState('idle');
    }
  };

  const handleDecisionAction = (prompt: string) => {
    // Re-run analysis with the new prompt (Enhance or Pivot)
    handleSubmit(prompt);
  };

  const handleRetry = () => {
    setFlowState('idle');
    setInput("");
    setAnalysisData(null);
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
          stopAfterStep={0} // We can remove this or keep it, but logic inside LoadingModal handles it now
          onComplete={handleAnalystComplete}
          isLoading={!analysisData}
          status={analysisData?.status}
        />
      )}

      {flowState === 'decision' && analysisData && (
        <EnhancePivot
          score={analysisData.pcs_score}
          onEnhance={handleDecisionAction}
          onPivot={handleDecisionAction}
          onRetry={handleRetry}
          onProceed={() => { }} // Not used for rejected ideas, but required by prop type
          rescuePlan={analysisData.rescue_plan}
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
