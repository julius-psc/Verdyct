import Image from "next/image";
import logo from "../../../../public/assets/brand/logos/default-logo.svg";
import Link from "next/link";
import { IconBrandTwitter, IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-react";

export default function Footer() {
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
              The AI-powered co-founder for your next big idea. analyze markets, predict success, and execute 10x faster.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 rounded-full bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-all duration-200">
                <IconBrandTwitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-all duration-200">
                <IconBrandGithub className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-all duration-200">
                <IconBrandLinkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="text-white font-medium text-sm mb-6">Product</h3>
            <ul className="space-y-4">
              <li>
                <Link href="#about" className="text-neutral-300 hover:text-white transition-colors duration-200 text-sm">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-neutral-300 hover:text-white transition-colors duration-200 text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-neutral-300 hover:text-white transition-colors duration-200 text-sm">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-neutral-300 hover:text-white transition-colors duration-200 text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-white font-medium text-sm mb-6">Company</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-neutral-300 hover:text-white transition-colors duration-200 text-sm">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-neutral-300 hover:text-white transition-colors duration-200 text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-neutral-300 hover:text-white transition-colors duration-200 text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-300 hover:text-white transition-colors duration-200 text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-white font-medium text-sm mb-6">Legal</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/legal" className="text-neutral-300 hover:text-white transition-colors duration-200 text-sm">
                  Mentions Légales
                </Link>
              </li>
              <li>
                <Link href="/legal" className="text-neutral-300 hover:text-white transition-colors duration-200 text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal" className="text-neutral-300 hover:text-white transition-colors duration-200 text-sm">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-500 text-xs">
            © {new Date().getFullYear()} Verdyct Inc. All rights reserved.
          </p>
          <div className="flex gap-8">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-neutral-500 text-xs">All systems operational</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

