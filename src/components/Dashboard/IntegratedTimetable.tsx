import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pill, Apple, CheckCircle2 } from 'lucide-react';

interface Task {
    id: string;
    type: 'supplement' | 'nutrition';
    title: string;
    time: string;
    dosage?: string;
    completed: boolean;
}

const mockTasks: Task[] = [
    { id: '1', type: 'supplement', title: 'Vitamin D3 & K2', time: '08:00 AM', dosage: '2 Drops', completed: false },
    { id: '2', type: 'nutrition', title: 'Anti-inflammatory Smoothie', time: '08:30 AM', completed: false },
    { id: '3', type: 'supplement', title: 'Omega 3 Fish Oil', time: '01:00 PM', dosage: '1 Capsule', completed: false },
];

const mockDates = ['Mon 12', 'Tue 13', 'Wed 14', 'Thu 15', 'Fri 16', 'Sat 17', 'Sun 18'];

export const IntegratedTimetable: React.FC = () => {
    const { t } = useTranslation();
    const [tasks, setTasks] = useState<Task[]>(mockTasks);
    const [activeDate, setActiveDate] = useState('Wed 14');

    const toggleTask = (id: string) => {
        setTasks(prev => prev.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
    };

    return (
        <div className="w-full space-y-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
                    {t('timetable')}
                </h3>
            </div>

            {/* Date Scroller */}
            <div className="flex overflow-x-auto pb-4 gap-3 hide-scrollbar snap-x">
                {mockDates.map((date) => (
                    <button
                        key={date}
                        onClick={() => setActiveDate(date)}
                        className={`snap-center flex flex-col items-center min-w-[4rem] p-3 rounded-2xl transition-all ${activeDate === date
                                ? 'bg-[var(--color-healing-green)] text-white shadow-lg shadow-[var(--color-healing-green)]/20 scale-105'
                                : 'glass-panel text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5'
                            }`}
                    >
                        <span className="text-xs uppercase tracking-wider mb-1">{date.split(' ')[0]}</span>
                        <span className="text-lg font-bold">{date.split(' ')[1]}</span>
                    </button>
                ))}
            </div>

            {/* Task Cards */}
            <div className="space-y-4 pb-20">
                {tasks.map(task => (
                    <div key={task.id} className={`glass-panel p-4 flex flex-col gap-3 transition-colors border-l-4 ${task.completed ? 'border-l-[var(--color-gold)] opacity-70' : 'border-l-[var(--color-healing-green)]'}`}>
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-xl ${task.type === 'supplement' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' : 'bg-green-50 text-green-600 dark:bg-green-900/30'}`}>
                                    {task.type === 'supplement' ? <Pill className="w-5 h-5" /> : <Apple className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[var(--text-primary)]">{task.title}</h4>
                                    <p className="text-xs text-[var(--text-secondary)] mt-1 flex items-center gap-2">
                                        <span className="font-medium bg-[var(--bg-secondary)] px-2 py-0.5 rounded-md border border-[var(--glass-border)]">
                                            {task.time}
                                        </span>
                                        {task.dosage && <span>• {task.dosage}</span>}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => toggleTask(task.id)}
                            className={`mt-2 w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-all haptic-ripple
                ${task.completed
                                    ? 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--glass-border)]'
                                    : 'bg-[var(--color-healing-green)] text-white shadow-md hover:bg-[var(--color-healing-green-light)]'
                                }`}
                        >
                            {task.completed ? (
                                <>
                                    <CheckCircle2 className="w-5 h-5 text-[var(--color-gold)]" />
                                    Completed
                                </>
                            ) : (
                                t('adherence')
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
