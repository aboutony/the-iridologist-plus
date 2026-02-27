import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, ArrowRight } from 'lucide-react';
import type { Language } from '../../models/types';

interface DailyEchoProps {
    title: Record<Language, string>;
    message: Record<Language, string>;
}

export const DailyEcho: React.FC<DailyEchoProps> = ({ title, message }) => {
    const { i18n } = useTranslation();
    const currentLang = i18n.language as Language;

    return (
        <div className="glass-panel relative overflow-hidden group cursor-pointer border-[var(--color-healing-green)] border-l-4">
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-healing-green)]/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="p-5 flex gap-4 items-start relative z-10">
                <div className="bg-[var(--color-healing-green)] text-white p-3 rounded-2xl shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <h4 className="text-xs uppercase tracking-widest text-[var(--color-healing-green)] font-semibold mb-1 flex items-center gap-2">
                        Daily Echo Insights
                    </h4>
                    <h3 className="font-heading font-bold text-lg text-[var(--text-primary)] mb-1">
                        {title[currentLang] || title.en}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                        {message[currentLang] || message.en}
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[var(--color-healing-green)] opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                        Read Full Insight <ArrowRight className="w-3 h-3" />
                    </div>
                </div>
            </div>
        </div>
    );
};
