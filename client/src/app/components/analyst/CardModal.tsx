import React, { useRef, useState, useEffect } from 'react';
import { X, Download, Share2, Check, Linkedin, Twitter, Link as LinkIcon, Copy } from 'lucide-react';
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
    const [copied, setCopied] = useState(false);

    // Animation Logic
    useEffect(() => {
        if (isOpen) {
            const timer1 = setTimeout(() => {
                setShowStamp(true);
                setStampVisible(true);
            }, 500);

            const timer2 = setTimeout(() => {
                setShowStamp(false);
            }, 2500);

            const timer3 = setTimeout(() => {
                setStampVisible(false);
            }, 3000);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
                clearTimeout(timer3);
            };
        } else {
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
            const dataUrl = await toPng(cardRef.current, {
                cacheBust: true,
                pixelRatio: 2,
                skipAutoScale: true,
                fontEmbedCSS: ''
            });
            download(dataUrl, `verdyct-${data.projectName.toLowerCase().replace(/\s+/g, '-')}.png`);
        } catch (err) {
            console.error('Failed to generate image', err);
        } finally {
            setIsDownloading(false);
        }
    };

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `I just got a ${data.score}/100 score on Verdyct for my startup idea: ${data.projectName}. ${theme.stamp} #Verdyct #StartupValuation`;

    const handleShareTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    };

    const handleShareLinkedIn = () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl p-6 flex flex-col items-center gap-6 animate-in zoom-in-95 duration-200 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center space-y-1 mt-2">
                    <h3 className="text-xl font-bold text-white">Share Your Result</h3>
                    <p className="text-sm text-neutral-400">Challenge your friends to beat your score.</p>
                </div>

                {/* Card Preview - Compact & Rounded */}
                <div className="relative w-full h-[420px] flex items-center justify-center my-2 group">
                    {/* Background Glow */}
                    <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] opacity-40 transition-opacity duration-300 group-hover:opacity-60", theme.bg.replace('bg-', 'bg-') === 'bg-black' ? 'bg-primary-red' : theme.bg)} />

                    {/* Card Container - Absolute to prevent flow expansion */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div
                            ref={cardRef}
                            style={{ padding: '40px' }}
                            className="scale-[0.65] origin-center cursor-pointer transition-transform duration-300 hover:scale-[0.67]"
                            onClick={handleDownload}
                            title="Click to Download"
                        >
                            <div className="shadow-2xl rounded-[32px] overflow-hidden">
                                <VerdyctCard
                                    score={data.score}
                                    level={data.level}
                                    projectName={data.projectName}
                                    summary={data.summary}
                                />
                            </div>

                            {/* ANIMATED STAMP OVERLAY - Adjusted to be inside the padded container for capture */}
                            {stampVisible && (
                                <div
                                    className={cn(
                                        "absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none z-50 transition-all duration-500",
                                        theme.stampRotate,
                                        showStamp ? "scale-100 opacity-100" : "scale-150 opacity-0"
                                    )}
                                    style={{ transitionTimingFunction: showStamp ? 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'ease-out' }}
                                >
                                    <div className={cn(
                                        "border-[8px] border-double px-6 py-2 rounded-xl backdrop-blur-[0px] bg-black/50",
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

                {/* Actions */}
                <div className="w-full space-y-3 z-10">
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="w-full h-12 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-200 transition-all active:scale-[0.98] text-sm"
                    >
                        <Download className="w-4 h-4" />
                        {isDownloading ? 'Generating...' : 'Download Image'}
                    </button>

                    {typeof navigator !== 'undefined' && navigator.share && (
                        <button
                            onClick={() => {
                                navigator.share({
                                    title: 'Verdyct AI Evaluation',
                                    text: `I just got a ${data.score}/100 score on Verdyct for my startup idea: ${data.projectName}.`,
                                    url: window.location.href
                                }).catch(() => { });
                            }}
                            className="w-full h-12 bg-neutral-800 border border-neutral-700 text-white font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-700 transition-all active:scale-[0.98] text-sm"
                        >
                            <Share2 className="w-4 h-4" />
                            Share Result
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
