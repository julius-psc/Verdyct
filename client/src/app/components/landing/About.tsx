import Image from 'next/image';
import analyst from "../../../../public/assets/images/analyst-card.svg"
import architect from "../../../../public/assets/images/architect-card.svg"
import financier from "../../../../public/assets/images/financier-card.svg"
import spy from "../../../../public/assets/images/spy-card.svg"

export default function About() {
  return (
    <section id="about" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            From idea to Verdyct in <span className="text-primary-red">Minutes.</span>
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            You don&apos;t just get a report. You get actionable assets, powered by our specialized AI agents.
          </p>
        </div>

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-2 gap-3 max-w-xl mx-auto">
          {/* The Analyst */}
          <div className="relative">
            <Image src={analyst} alt="The Analyst" className="w-full h-auto" />
            <div className="absolute top-3 left-3 right-3">
              <h3 className="text-lg font-bold text-white mb-1.5">The Analyst</h3>
              <p className="text-sm text-white opacity-70 leading-snug">
                Sizes your total market, finds your target audience, and reveals the keywords they&apos;re actively searching for.
              </p>
            </div>
          </div>

          {/* The Spy */}
          <div className="relative">
            <Image src={spy} alt="The Spy" className="w-full h-auto" />
            <div className="absolute top-3 left-3 right-3">
              <h3 className="text-lg font-bold text-white mb-1.5">The Spy</h3>
              <p className="text-sm text-white opacity-70 leading-snug">
                Instantly maps your top competitors, analyzing their pricing, features, and the strategic weaknesses you can exploit.
              </p>
            </div>
          </div>

          {/* The Architect */}
          <div className="relative">
            <Image src={architect} alt="The Architect" className="w-full h-auto" />
            <div className="absolute top-3 left-3 right-3">
              <h3 className="text-lg font-bold text-white mb-1.5">The Architect</h3>
              <p className="text-sm text-white opacity-70 leading-snug">
                Designs your technical roadmap and builds your <strong>Data Moat</strong>, ensuring your startup remains defensible as it scales.
              </p>
            </div>
          </div>

          {/* The Financier */}
          <div className="relative">
            <Image src={financier} alt="The Financier" className="w-full h-auto" />
            <div className="absolute top-3 left-3 right-3">
              <h3 className="text-lg font-bold text-white mb-1.5">The Financier</h3>
              <p className="text-sm text-white opacity-70 leading-snug">
                Calculates your potential profit, estimating your Customer Acquisition Cost (CAC), Lifetime Value (LTV), and path to revenue.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}