import Image from 'next/image';
import analyst from "../../../../../public/assets/images/analyst-card.svg"
import architect from "../../../../../public/assets/images/architect-card.svg"
import financier from "../../../../../public/assets/images/financier-card.svg"
import spy from "../../../../../public/assets/images/spy-card.svg"
import { useTranslations } from 'next-intl';

export default function About() {
  const t = useTranslations('About');

  return (
    <section id="about" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t.rich('title', {
              span: (chunks) => <span className="text-primary-red">{chunks}</span>
            })}
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-2 gap-3 max-w-xl mx-auto">
          {/* The Analyst */}
          <div className="relative">
            <Image src={analyst} alt="The Analyst" className="w-full h-auto" />
            <div className="absolute top-3 left-3 right-3">
              <h3 className="text-lg font-bold text-white mb-1.5">{t('agents.analyst.title')}</h3>
              <p className="text-sm text-white opacity-70 leading-snug">
                {t('agents.analyst.description')}
              </p>
            </div>
          </div>

          {/* The Spy */}
          <div className="relative">
            <Image src={spy} alt="The Spy" className="w-full h-auto" />
            <div className="absolute top-3 left-3 right-3">
              <h3 className="text-lg font-bold text-white mb-1.5">{t('agents.spy.title')}</h3>
              <p className="text-sm text-white opacity-70 leading-snug">
                {t('agents.spy.description')}
              </p>
            </div>
          </div>

          {/* The Architect */}
          <div className="relative">
            <Image src={architect} alt="The Architect" className="w-full h-auto" />
            <div className="absolute top-3 left-3 right-3">
              <h3 className="text-lg font-bold text-white mb-1.5">{t('agents.architect.title')}</h3>
              <p className="text-sm text-white opacity-70 leading-snug">
                {t.rich('agents.architect.description', {
                  strong: (chunks) => <strong>{chunks}</strong>
                })}
              </p>
            </div>
          </div>

          {/* The Financier */}
          <div className="relative">
            <Image src={financier} alt="The Financier" className="w-full h-auto" />
            <div className="absolute top-3 left-3 right-3">
              <h3 className="text-lg font-bold text-white mb-1.5">{t('agents.financier.title')}</h3>
              <p className="text-sm text-white opacity-70 leading-snug">
                {t('agents.financier.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}