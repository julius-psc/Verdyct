'use client';

import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion } from "motion/react";

interface PageWrapperProps {
    children: React.ReactNode;
    className?: string;
    hideFooter?: boolean;
}

export default function PageWrapper({ children, className = "", hideFooter = false }: PageWrapperProps) {
    return (
        <div className="bg-[#1B1818] min-h-screen flex flex-col relative overflow-x-hidden">
            {/* Global Background Layer */}
            <div
                className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-color-dodge"
                style={{
                    backgroundImage: `url('/assets/illustrations/hero-bg.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'top center',
                    backgroundRepeat: 'no-repeat'
                }}
            />

            {/* Gradient Overlay for depth */}
            <div className="fixed inset-0 z-0 bg-gradient-to-b from-transparent via-[#1B1818]/50 to-[#1B1818] pointer-events-none" />

            <Navbar />

            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`flex-grow pt-32 relative z-10 w-full ${className}`}
            >
                {children}
            </motion.main>

            {!hideFooter && <Footer />}
        </div>
    );
}
