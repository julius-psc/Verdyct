'use client';

import { motion } from 'motion/react';

interface LabyrinthLoaderProps {
    progress: number; // 0 to 100
    isComplete: boolean;
    color?: string;
    isError?: boolean;
}

export default function LabyrinthLoader({ progress, isComplete, color = '#ef4444', isError = false }: LabyrinthLoaderProps) {
    // A cleaner, tech-inspired circuit path (straight lines, 90-degree turns)
    // Box: 600x200
    // Start: Left (50, 100) -> Center weaving -> Right (550, 100)
    const pathD = "M 50 100 L 100 100 L 100 50 L 180 50 L 180 150 L 260 150 L 260 80 L 340 80 L 340 120 L 420 120 L 420 60 L 500 60 L 500 100 L 550 100";

    return (
        <div className="relative w-full h-full min-h-[100px] flex items-center justify-center">
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 600 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet"
                className="opacity-90"
                suppressHydrationWarning
            >
                {/* Background Track */}
                <path
                    d={pathD}
                    stroke="#333"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-30"
                />

                {/* Progress Path */}
                {!isError && (
                    <motion.path
                        d={pathD}
                        stroke={color}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: progress / 100 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
                    />
                )}

                {/* Error Path */}
                {isError && (
                    <path
                        d={pathD}
                        stroke="#ef4444"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ filter: 'drop-shadow(0 0 6px #ef4444)' }}
                    />
                )}

                {/* The Head: Red Glow instead of White Circle */}
                {!isComplete && !isError && (
                    <motion.circle
                        r="3"
                        fill={color}
                        initial={false}
                        animate={{}}
                        style={{
                            offsetPath: `path('${pathD}')`,
                            offsetRotate: '0deg',
                            offsetDistance: `${progress}%`,
                            filter: `drop-shadow(0 0 12px ${color})`,
                            transition: 'offset-distance 0.3s linear'
                        } as any}
                    />
                )}
            </svg>
            {/* Removed percentage text as per implied "cleaner" request if fonts were an issue, 
          but usually the user meant the status font in the modal. Labyrinth text was small mono which fits circuit theme. 
          I'll keep it hidden to be cleaner. */}
        </div>
    );
}
