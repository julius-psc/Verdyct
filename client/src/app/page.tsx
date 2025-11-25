import Navbar from "./components/landing/Navbar";
import Hero from "./components/landing/Hero";
import About from "./components/landing/About";
import Pricing from "./components/landing/Pricing";
import CTA from "./components/landing/CTA";
import Footer from "./components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="bg-[#1B1818]">
      <Navbar />
      <Hero />
      <About />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}
