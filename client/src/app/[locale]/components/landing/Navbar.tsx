'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "motion/react"
import { IconLayoutDashboard, IconUser, IconSettings, IconLogout, IconChevronDown } from '@tabler/icons-react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import logo from "../../../../../public/assets/brand/logos/default-logo.svg";
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '../LanguageSwitcher';

export default function Navbar() {
  const t = useTranslations('Navbar');
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session?.user) {
          // Fetch credits
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
          const response = await fetch(`${apiUrl}/api/user/credits`, {
            headers: {
              'Authorization': `Bearer ${session.access_token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setCredits(data.credits);
          }
        }

      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);


  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-6"
      initial={false}
      animate={{
        paddingTop: isScrolled ? '1rem' : '1.5rem',
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <motion.div
        className="flex flex-col md:flex-row items-center justify-between px-6 py-2 relative"
        initial={false}
        animate={{
          width: isScrolled ? (typeof window !== 'undefined' && window.innerWidth < 768 ? '95%' : '60%') : '100%',
          backgroundColor: isScrolled || isMobileMenuOpen ? 'rgba(0, 0, 0, 0.8)' : 'transparent',
          backdropFilter: isScrolled || isMobileMenuOpen ? 'blur(12px)' : 'blur(0px)',
          border: isScrolled || isMobileMenuOpen ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent',
          borderRadius: isScrolled || isMobileMenuOpen ? '1rem' : '0rem',
          height: isMobileMenuOpen ? 'auto' : undefined,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="w-full md:w-auto flex items-center justify-between">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center gap-3">
            <Image src={logo} alt="Verdyct Logo" className="h-6 md:h-8 w-auto" />
            <span className="text-white font-semibold text-lg md:text-xl">Verdyct</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <button
              className="text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <IconChevronDown className="rotate-180" /> : <IconChevronDown />}
            </button>
          </div>
        </div>

        {/* Nav Links - Center (Desktop) */}
        <div className="hidden md:flex items-center gap-8 px-6 py-2 absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
          <Link
            href="/"
            className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm tracking-wide"
          >
            {t('home')}
          </Link>
          <Link
            href="/#how-it-works"
            className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm tracking-wide"
          >
            {t('howItWorks')}
          </Link>
          <Link
            href="/#pricing"
            className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm tracking-wide"
          >
            {t('pricing')}
          </Link>
        </div>

        {/* Right Side - CTA (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />
          {!loading && (
            user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  onBlur={() => setTimeout(() => setIsProfileOpen(false), 200)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-full transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-white text-xs font-bold border border-white/10">
                    {user.email?.[0].toUpperCase() || 'U'}
                  </div>
                  <IconChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-[#1B1818] border border-neutral-800 rounded-xl shadow-xl overflow-hidden py-1 z-50"
                    >
                      <div className="px-4 py-3 border-b border-neutral-800">
                        <p className="text-sm text-white font-medium truncate">{user.email}</p>
                        <p className="text-xs text-neutral-500 flex justify-between">
                          <span>Plan: Free</span>
                          <span className="text-emerald-400 font-medium">{credits !== null ? `${credits} credits` : '...'}</span>
                        </p>
                      </div>

                      <div className="p-1">
                        <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors">
                          <IconLayoutDashboard className="w-4 h-4" />
                          {t('dashboard')}
                        </Link>
                        <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors">
                          <IconUser className="w-4 h-4" />
                          {t('profile')}
                        </Link>
                        <Link href="/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors">
                          <IconSettings className="w-4 h-4" />
                          {t('settings')}
                        </Link>
                        <Link href="/legal" className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors">
                          <span className="w-4 text-center">⚖️</span>
                          {t('legal')}
                        </Link>
                      </div>

                      <div className="border-t border-neutral-800 p-1">
                        <Link href="/logout" className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                          <IconLogout className="w-4 h-4" />
                          {t('logout')}
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-black bg-white/90 hover:bg-white px-5 py-2 rounded-full text-sm font-medium transition-all duration-200"
              >
                {t('login')}
              </Link>
            )
          )}
        </div>

        {/* Mobile Menu Content */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full md:hidden flex flex-col gap-4 pt-6 pb-2 border-t border-white/10 mt-4"
            >
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-neutral-300 hover:text-white font-medium py-2">{t('home')}</Link>
              <Link href="/#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-neutral-300 hover:text-white font-medium py-2">{t('howItWorks')}</Link>
              <Link href="/#pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-neutral-300 hover:text-white font-medium py-2">{t('pricing')}</Link>

              <div className="h-px bg-white/10 my-1" />

              {!loading && (
                user ? (
                  <div className="flex flex-col gap-2">
                    <div className="text-xs text-neutral-500 mb-2">Signed in as {user.email}</div>
                    <Link href="/dashboard" className="flex items-center gap-2 text-white py-2"><IconLayoutDashboard className="w-4 h-4" /> {t('dashboard')}</Link>
                    <Link href="/settings" className="flex items-center gap-2 text-white py-2"><IconSettings className="w-4 h-4" /> {t('settings')}</Link>
                    <Link href="/logout" className="flex items-center gap-2 text-red-400 py-2"><IconLogout className="w-4 h-4" /> {t('logout')}</Link>
                  </div>
                ) : (
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="bg-white text-black text-center py-3 rounded-lg font-bold mt-2">
                    {t('login')}
                  </Link>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </motion.nav>
  );
}