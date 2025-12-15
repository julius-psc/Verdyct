import Navbar from "./components/landing/Navbar";
import Hero from "./components/landing/Hero";
import About from "./components/landing/About";
import HowItWorks from "./components/landing/HowItWorks";
import Pricing from "./components/landing/Pricing";
import FAQ from "./components/landing/FAQ";
import CTA from "./components/landing/CTA";
import Footer from "./components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="bg-[#1B1818] min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <About />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}

