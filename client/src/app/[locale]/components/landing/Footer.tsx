import Image from "next/image";
import logo from "../../../../../public/assets/brand/logos/default-logo.svg";
import { Link } from '@/i18n/routing';
import { IconBrandTwitter, IconBrandInstagram, IconBrandLinkedin } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="w-full border-t border-white/5 bg-[#1B1818]">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
          {/* Logo and Description - Spans 2 columns */}
          <div className="lg:col-span-2 pr-8">
            <Link href="/" className="flex items-center gap-3 mb-6 inline-block">
              <Image src={logo} alt="Verdyct Logo" className="h-8 w-auto" />
              <span className="text-white font-bold text-lg tracking-tight">Verdyct</span>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed mb-8 max-w-sm">
              {t('description')}
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 rounded-full bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-all duration-200">
                <IconBrandTwitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-all duration-200">
                <IconBrandInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-all duration-200">
                <IconBrandLinkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="text-white font-medium text-sm mb-6">{t('product.title')}</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/#features" className="text-neutral-300 hover:text-white transition-colors duration-200 text-sm">
                  {t('product.features')}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-neutral-300 hover:text-white transition-colors duration-200 text-sm">
                  {t('product.pricing')}
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-neutral-300 hover:text-white transition-colors duration-200 text-sm">
                  {t('product.howItWorks')}
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-neutral-300 hover:text-white transition-colors duration-200 text-sm">
                  {t('product.faq')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-white font-medium text-sm mb-6">{t('company.title')}</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-neutral-300 hover:text-white transition-colors duration-200 text-sm">
                  {t('company.about')}
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-neutral-300 hover:text-white transition-colors duration-200 text-sm">
                  {t('company.careers')}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-neutral-300 hover:text-white transition-colors duration-200 text-sm">
                  {t('company.blog')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-300 hover:text-white transition-colors duration-200 text-sm">
                  {t('company.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-white font-medium text-sm mb-6">{t('legal.title')}</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/legal" className="text-neutral-300 hover:text-white transition-colors duration-200 text-sm">
                  {t('legal.mentions')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-neutral-300 hover:text-white transition-colors duration-200 text-sm">
                  {t('legal.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-neutral-300 hover:text-white transition-colors duration-200 text-sm">
                  {t('legal.disclaimer')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-500 text-xs">
            {t('rights', { year: new Date().getFullYear() })}
          </p>
          <div className="flex gap-8">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-neutral-500 text-xs">{t('status')}</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

