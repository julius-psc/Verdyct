import React, { useRef, useState, useEffect } from 'react';
import { X, Download, Share2, Check } from 'lucide-react';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import { VerdyctCard, getCardTheme } from './VerdyctCard';
import { cn } from '@/lib/utils';

interface CardModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: {
        score: number;
        level: string;
        projectName: string;
        summary: string;
    };
}

export default function CardModal({ isOpen, onClose, data }: CardModalProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [showStamp, setShowStamp] = useState(false);
    const [stampVisible, setStampVisible] = useState(false);

    // Animation Logic
    useEffect(() => {
        if (isOpen) {
            // Wait a brief moment then slam the stamp
            const timer1 = setTimeout(() => {
                setShowStamp(true);
                setStampVisible(true);
            }, 500);

            // Hide stamp after 2.5 seconds (0.5s delay + 2s visibility)
            const timer2 = setTimeout(() => {
                setShowStamp(false);
            }, 2500);

            // Remove from DOM after fade out transition (0.5s fade)
            const timer3 = setTimeout(() => {
                setStampVisible(false);
            }, 3000);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
                clearTimeout(timer3);
            };
        } else {
            // Reset states when closed
            setShowStamp(false);
            setStampVisible(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const theme = getCardTheme(data.score);

    const handleDownload = async () => {
        if (!cardRef.current) return;

        try {
            setIsDownloading(true);
            // The stamp is outside cardRef, so it won't be captured!
            const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
            download(dataUrl, `verdyct-${data.projectName.toLowerCase().replace(/\s+/g, '-')}.png`);
        } catch (err) {
            console.error('Failed to generate image', err);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-lg bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold text-white">Share Your Verdyct</h3>
                    <p className="text-sm text-neutral-400">Download your score card and share it with the world.</p>
                </div>

                {/* Card Preview Container - Click to Download */}
                <div
                    onClick={handleDownload}
                    className="relative shadow-2xl rounded-sm overflow-hidden border border-white/5 scale-[0.85] origin-top mb-[-80px] cursor-pointer hover:scale-[0.87] transition-transform duration-300 ring-offset-4 ring-offset-black hover:ring-2 hover:ring-white/20 group"
                    title="Click to Download"
                >
                    <VerdyctCard
                        ref={cardRef}
                        score={data.score}
                        level={data.level}
                        projectName={data.projectName}
                        summary={data.summary}
                    />

                    {/* ANIMATED STAMP OVERLAY */}
                    {stampVisible && (
                        <div
                            className={cn(
                                "absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none z-50 transition-all duration-500",
                                theme.stampRotate,
                                // theme.stampBlend, // REMOVED BLEND MODE for maximum visibility during animation
                                showStamp ? "scale-100 opacity-100" : "scale-150 opacity-0" // Slam in / Fade out
                            )}
                            style={{ transitionTimingFunction: showStamp ? 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'ease-out' }} // Elastic bounce for entrance
                        >
                            <div className={cn(
                                "border-[8px] border-double px-6 py-2 rounded-xl backdrop-blur-[0px] bg-black/50", // Added slight bg for pop
                                theme.stampColor
                            )}>
                                <span className={cn("text-4xl font-black uppercase tracking-widest whitespace-nowrap drop-shadow-2xl", theme.stampColor)}>
                                    {theme.stamp}
                                </span>
                            </div>
                        </div>
                    )}
                </div>



            </div>
        </div>
    );
}
