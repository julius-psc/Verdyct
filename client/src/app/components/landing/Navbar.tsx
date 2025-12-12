'use client';

import { useState, useEffect } from 'react';
import { motion } from "motion/react"
import { IconMoon, IconLayoutDashboard } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import logo from "../../../../public/assets/brand/logos/default-logo.svg";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-neutral-300 hover:text-white transition-colors duration-200 text-sm font-medium"
          >
            Home
          </Link>
          <Link
            href="/how-it-works"
            className="text-neutral-300 hover:text-white transition-colors duration-200 text-sm font-medium"
          >
            How it works
          </Link>
          <Link
            href="/pricing"
            className="text-neutral-300 hover:text-white transition-colors duration-200 text-sm font-medium"
          >
            Pricing
          </Link>
        </div>

        {/* Right Side - CTA + Theme Toggle */}
        <div className="flex items-center gap-3">
          {!loading && (
            user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-white bg-primary-red px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 hover:opacity-90"
              >
                <IconLayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-white bg-primary-red px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 hover:opacity-90"
              >
                Login
              </Link>
            )
          )}

          <button className="border border-white/20 text-neutral-300 hover:text-white hover:border-white/40 p-2 rounded-full transition-all duration-200 hover:scale-110 active:scale-95">
            <IconMoon className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </motion.nav>
  );
}