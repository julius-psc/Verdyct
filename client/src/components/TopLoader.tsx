'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function TopLoader() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Start progress bar
        const progressBar = document.getElementById('top-loader-bar');
        if (progressBar) {
            progressBar.style.width = '0%';
            progressBar.style.opacity = '1';

            // Simulate progress
            const interval = setInterval(() => {
                const currentWidth = parseFloat(progressBar.style.width);
                if (currentWidth < 90) {
                    progressBar.style.width = `${currentWidth + 10}%`;
                }
            }, 100);

            // Complete progress when navigation is done
            const timeout = setTimeout(() => {
                clearInterval(interval);
                progressBar.style.width = '100%';

                // Hide after completion
                setTimeout(() => {
                    progressBar.style.opacity = '0';
                }, 200);
            }, 500);

            return () => {
                clearInterval(interval);
                clearTimeout(timeout);
            };
        }
    }, [pathname, searchParams]);

    return (
        <div
            id="top-loader-bar"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '0%',
                height: '3px',
                background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)',
                zIndex: 9999,
                transition: 'width 0.2s ease, opacity 0.3s ease',
                opacity: 0,
            }}
        />
    );
}
