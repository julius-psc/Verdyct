'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "motion/react"
import { IconLayoutDashboard, IconUser, IconSettings, IconLogout, IconChevronDown } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import logo from "../../../../public/assets/brand/logos/default-logo.svg";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
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
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-20 flex justify-center px-4 py-6"
      initial={false}
      animate={{
        paddingTop: isScrolled ? '1rem' : '1.5rem',
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <motion.div
        className="flex items-center justify-between px-3 py-2"
        initial={false}
        animate={{
          width: isScrolled ? '60%' : '100%',
          backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.4)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(8px)' : 'blur(0px)',
          border: isScrolled ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent',
          borderRadius: isScrolled ? '1rem' : '0rem',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* Logo - Left */}
        <Link href="/" className="flex items-center gap-1">
          <Image src={logo} alt="Verdyct Logo" className="h-10 w-auto" />
          <span className="text-white font-semibold text-xl">Verdyct</span>
        </Link>

        {/* Nav Links - Center */}
        <div className="flex items-center gap-8 bg-white/5 px-6 py-2 rounded-full border border-white/5 backdrop-blur-md">
          <Link
            href="/"
            className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm tracking-wide"
          >
            Home
          </Link>
          <Link
            href="#how-it-works"
            className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm tracking-wide"
          >
            How it works
          </Link>
          <Link
            href="#pricing"
            className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm tracking-wide"
          >
            Pricing
          </Link>
        </div>

        {/* Right Side - CTA */}
        <div className="flex items-center gap-3">
          {!loading && (
            user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  onBlur={() => setTimeout(() => setIsProfileOpen(false), 200)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50 hover:border-neutral-700 rounded-full transition-all duration-200"
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
                      className="absolute right-0 top-full mt-2 w-56 bg-[#1B1818] border border-neutral-800 rounded-xl shadow-xl overflow-hidden py-1"
                    >
                      <div className="px-4 py-3 border-b border-neutral-800">
                        <p className="text-sm text-white font-medium truncate">{user.email}</p>
                        <p className="text-xs text-neutral-500">Plan: Free</p>
                      </div>

                      <div className="p-1">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                        >
                          <IconLayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                        >
                          <IconUser className="w-4 h-4" />
                          Profile
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                        >
                          <IconSettings className="w-4 h-4" />
                          Settings
                        </Link>
                      </div>

                      <div className="border-t border-neutral-800 p-1">
                        <Link
                          href="/logout"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <IconLogout className="w-4 h-4" />
                          Log Out
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
                Login
              </Link>
            )
          )}
        </div>
      </motion.div>
    </motion.nav>
  );
}