import Image from "next/image";
import logo from "../../../../public/assets/brand/logos/default-logo.svg";

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-1 mb-4">
              <Image src={logo} alt="Verdyct Logo" className="h-10 w-auto" />
              <span className="text-white font-semibold text-xl">Verdyct</span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
              Empowering entrepreneurs to validate, predict, and launch successful startups through data-driven insights and intelligent analysis.
            </p>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <a href="/features" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Features
                </a>
              </li>
              <li>
                <a href="/pricing" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/how-it-works" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  How it works
                </a>
              </li>
              <li>
                <a href="/faq" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="/about" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  About us
                </a>
              </li>
              <li>
                <a href="/careers" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Careers
                </a>
              </li>
              <li>
                <a href="/blog" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Blog
                </a>
              </li>
              <li>
                <a href="/contact" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a href="/privacy" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Privacy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Terms
                </a>
              </li>
              <li>
                <a href="/security" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Security
                </a>
              </li>
              <li>
                <a href="/cookies" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800">
          <p className="text-neutral-500 text-sm text-center">
            © {new Date().getFullYear()} Verdyct. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
