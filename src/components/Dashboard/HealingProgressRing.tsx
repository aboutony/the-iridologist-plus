import React from 'react';
import { useTranslation } from 'react-i18next';

interface HealingProgressRingProps {
    percentage: number;
}

export const HealingProgressRing: React.FC<HealingProgressRingProps> = ({ percentage }) => {
    const { t } = useTranslation();

    // Circle geometry
    const radius = 60;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center p-6 glass-panel relative overflow-hidden group">
            {/* Background glowing gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-healing-green)]/10 to-[var(--color-gold)]/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

            <div className="relative flex items-center justify-center">
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="transform -rotate-90 drop-shadow-md"
                >
                    {/* Background Ring */}
                    <circle
                        stroke="var(--glass-border)"
                        fill="transparent"
                        strokeWidth={stroke}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    {/* Progress Ring with glowing effect */}
                    <circle
                        stroke="url(#gradient)"
                        fill="transparent"
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        className="transition-all duration-1000 ease-out"
                    />
                    {/* Gradient Definition */}
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="var(--color-healing-green)" />
                            <stop offset="100%" stopColor="var(--color-gold)" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold font-heading text-[var(--color-healing-green)] dark:text-[var(--color-gold)]">
                        {percentage}%
                    </span>
                </div>
            </div>
            <p className="mt-4 font-semibold text-[var(--text-secondary)] text-sm tracking-wide uppercase">
                {t('adherence')} Rate
            </p>
        </div>
    );
};
