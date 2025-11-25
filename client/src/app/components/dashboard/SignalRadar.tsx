'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SignalPoint {
    label: string;
    value: number; // 0-100
    baseline: number; // 0-100
}

const SIGNALS: SignalPoint[] = [
    { label: 'Scroll Depth', value: 85, baseline: 70 },
    { label: 'Mouse Velocity', value: 92, baseline: 65 },
    { label: 'Form Abandon', value: 45, baseline: 40 }, // Lower is better? Assuming normalized 0-100 where higher is "more intense" or "better" depending on metric. Let's assume higher = stronger signal matching success.
    { label: 'Dwell Time', value: 78, baseline: 75 },
    { label: 'Rage Clicks', value: 20, baseline: 15 },
    { label: 'Nav Pattern', value: 88, baseline: 80 },
];

export default function SignalRadar() {
    const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

    const size = 300;
    const center = size / 2;
    const radius = 100;

    // Helper to calculate coordinates
    const getCoordinates = (value: number, index: number, total: number) => {
        const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
        const r = (value / 100) * radius;
        return {
            x: center + r * Math.cos(angle),
            y: center + r * Math.sin(angle),
        };
    };

    const points = useMemo(() => {
        return SIGNALS.map((s, i) => {
            const current = getCoordinates(s.value, i, SIGNALS.length);
            const baselineCoords = getCoordinates(s.baseline, i, SIGNALS.length);
            const labelPos = getCoordinates(125, i, SIGNALS.length); // Label further out
            return { ...s, current, baselineCoords, labelPos };
        });
    }, []);

    const currentPath = useMemo(() => {
        return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.current.x} ${p.current.y}`).join(' ') + ' Z';
    }, [points]);

    const baselinePath = useMemo(() => {
        return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.baselineCoords.x} ${p.baselineCoords.y}`).join(' ') + ' Z';
    }, [points]);

    // Grid levels
    const levels = [25, 50, 75, 100];

    return (
        <div className="relative w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-neutral-900/50 rounded-3xl border border-white/5 backdrop-blur-sm overflow-hidden">

            <div className="relative z-10 w-full max-w-[400px] aspect-square">
                <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible">
                    {/* Radar Grid */}
                    {levels.map((level) => (
                        <circle
                            key={level}
                            cx={center}
                            cy={center}
                            r={(level / 100) * radius}
                            fill="none"
                            stroke="#333"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                        />
                    ))}

                    {/* Axes */}
                    {points.map((p, i) => (
                        <line
                            key={i}
                            x1={center}
                            y1={center}
                            x2={p.labelPos.x}
                            y2={p.labelPos.y}
                            stroke="#333"
                            strokeWidth="1"
                        />
                    ))}

                    {/* Baseline Polygon (Success Boundary) */}
                    <path
                        d={baselinePath}
                        fill="rgba(100, 100, 100, 0.1)"
                        stroke="#666"
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                    />

                    {/* Current Status Polygon */}
                    <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        d={currentPath}
                        fill="rgba(16, 185, 129, 0.1)" // Emerald tint
                        stroke="#10B981" // Emerald-500
                        strokeWidth="2"
                    />

                    {/* Interactive Points */}
                    {points.map((p, i) => (
                        <g key={i}>
                            {/* Visible Dot */}
                            <circle
                                cx={p.current.x}
                                cy={p.current.y}
                                r={4}
                                fill="#1B1818"
                                stroke="#10B981"
                                strokeWidth={2}
                                className="pointer-events-none"
                            />
                            {/* Hit Area */}
                            <circle
                                cx={p.current.x}
                                cy={p.current.y}
                                r={15}
                                fill="transparent"
                                className="cursor-pointer"
                                onMouseEnter={() => setHoveredPoint(i)}
                                onMouseLeave={() => setHoveredPoint(null)}
                            />
                            {/* Label */}
                            <text
                                x={p.labelPos.x}
                                y={p.labelPos.y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className={`text-[10px] font-medium uppercase tracking-wider transition-colors duration-300 ${hoveredPoint === i ? 'fill-emerald-400' : 'fill-neutral-500'
                                    }`}
                            >
                                {p.label}
                            </text>
                        </g>
                    ))}
                </svg>

                {/* Tooltip */}
                <AnimatePresence>
                    {hoveredPoint !== null && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            style={{
                                left: `${(points[hoveredPoint].current.x / size) * 100}%`,
                                top: `${(points[hoveredPoint].current.y / size) * 100}%`,
                            }}
                            className="absolute -translate-x-1/2 -translate-y-full mt-[-12px] bg-neutral-800/90 border border-neutral-700 p-3 rounded-xl backdrop-blur-md pointer-events-none z-20 min-w-[140px]"
                        >
                            <div className="text-xs text-neutral-400 mb-1">{points[hoveredPoint].label}</div>
                            <div className="flex justify-between items-center gap-4">
                                <span className="text-emerald-400 font-bold">{points[hoveredPoint].value}</span>
                                <span className="text-xs text-neutral-500">vs {points[hoveredPoint].baseline} (Avg)</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-lg font-semibold text-white mb-1">Signal Correlation Map</h3>
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full border border-emerald-500 bg-emerald-500/10"></div>
                        <span className="text-neutral-300">Portfolio Profile</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full border border-neutral-500 border-dashed bg-neutral-500/10"></div>
                        <span className="text-neutral-400">Data Moat</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
