import React from 'react';
import { Sun, Sunset, Moon } from 'lucide-react';
import { IntegratedTimetable } from './IntegratedTimetable';
import { DailyEcho } from './DailyEcho';
import type { Language } from '../../models/types';

const vibeData = {
    title: {
        en: 'Morning Vibe Check',
        fr: 'Bilan du Matin',
        ar: 'فحص نبض الصباح',
    } as Record<Language, string>,
    message: {
        en: 'How are you feeling today? Track your emotional baseline to correlate with your supplement adherence.',
        fr: 'Comment vous sentez-vous aujourd\'hui ? Suivez votre état émotionnel de base.',
        ar: 'كيف تشعر اليوم؟ تتبع حالتك العاطفية الأساسية لربطها بالتزامك بالمكملات.',
    } as Record<Language, string>,
};

const periodCards = [
    { icon: Sun, label: 'Morning', time: '6 AM – 12 PM', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.08)', tasks: 3 },
    { icon: Sunset, label: 'Afternoon', time: '12 PM – 6 PM', color: '#F97316', bgColor: 'rgba(249, 115, 22, 0.08)', tasks: 2 },
    { icon: Moon, label: 'Evening', time: '6 PM – 11 PM', color: '#6366F1', bgColor: 'rgba(99, 102, 241, 0.08)', tasks: 1 },
];

export const JourneyView: React.FC = () => {
    return (
        <div className="zone-main zone-main--dashboard">
            {/* Vibe Check Diary */}
            <DailyEcho title={vibeData.title} message={vibeData.message} />

            {/* Morning / Noon / Evening Period Cards */}
            <div className="w-full" style={{ maxWidth: 420 }}>
                <h3 className="font-heading text-base font-semibold text-[var(--text-primary)] mb-3">
                    Today's Schedule
                </h3>
                <div className="grid grid-cols-3 gap-3">
                    {periodCards.map(({ icon: Icon, label, time, color, bgColor, tasks }) => (
                        <div
                            key={label}
                            className="glass-panel p-3 flex flex-col items-center text-center gap-2"
                            style={{ borderColor: color, borderTopWidth: 2 }}
                        >
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{ background: bgColor }}
                            >
                                <Icon size={18} style={{ color }} strokeWidth={1.8} />
                            </div>
                            <span className="text-xs font-semibold text-[var(--text-primary)]">{label}</span>
                            <span className="text-[10px] text-[var(--text-secondary)]">{time}</span>
                            <span
                                className="text-xs font-bold mt-1"
                                style={{ color }}
                            >
                                {tasks} tasks
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Interactive Timetable */}
            <IntegratedTimetable />
        </div>
    );
};

export default JourneyView;
