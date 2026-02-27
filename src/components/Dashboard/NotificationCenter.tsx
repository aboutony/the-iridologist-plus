import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Droplets, Utensils, Check, Bell } from 'lucide-react';
import type { AppNotification, Language } from '../../models/types';

const mockNotifications: AppNotification[] = [
    {
        id: 'n1',
        type: 'SupplementReminder',
        title: { en: 'Vitamin D3 & K2 Due', fr: 'Vitamine D3 & K2 DUE', ar: 'حان وقت فيتامين D3 & K2' },
        message: { en: 'Take 2 drops with your heaviest meal today.', fr: 'Prenez 2 gouttes avec votre repas le plus lourd aujourd\'hui.', ar: 'تناول قطرتين مع وجبتك الأثقل اليوم.' },
        isRead: false,
        createdAt: new Date().toISOString()
    },
    {
        id: 'n2',
        type: 'DailyEcho',
        title: { en: 'Echo: Stay Hydrated', fr: 'Écho: Restez Hydraté', ar: 'صدى: حافظ على رطوبتك' },
        message: { en: 'Remember to drink at least 2 liters of water.', fr: 'N\'oubliez pas de boire au moins 2 litres d\'eau.', ar: 'تذكر شرب ما لا يقل عن لترين من الماء.' },
        isRead: true,
        createdAt: new Date(Date.now() - 86400000).toISOString()
    }
];

export const NotificationCenter: React.FC = () => {
    const { i18n } = useTranslation();
    const currentLang = i18n.language as Language;
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState(mockNotifications);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const getIconForType = (type: string, messageEn: string) => {
        if (type === 'SupplementReminder') {
            if (messageEn.toLowerCase().includes('water') || messageEn.toLowerCase().includes('liquid') || messageEn.toLowerCase().includes('drops')) {
                return <Droplets className="w-5 h-5 text-blue-500" />;
            }
            return <Utensils className="w-5 h-5 text-orange-500" />;
        }
        return <AlertCircle className="w-5 h-5 text-[var(--color-healing-green)]" />;
    };

    return (
        <div className="relative z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors relative"
            >
                <Bell className="w-6 h-6 text-[#FFFFFF]" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-[#00172D] animate-pulse" />
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 top-12 mt-2 w-80 glass-panel shadow-2xl rounded-2xl overflow-hidden z-50 border-[var(--glass-border)] animate-fade-in origin-top-right">
                        <div className="p-4 border-b border-[var(--glass-border)] flex justify-between items-center bg-[var(--bg-secondary)]/50">
                            <h3 className="font-heading font-semibold text-[var(--text-primary)] relative">
                                Notifications
                                {unreadCount > 0 && <span className="absolute -right-6 top-0.5 bg-[var(--color-healing-green)] text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
                            </h3>
                            <button
                                onClick={markAllRead}
                                className="text-xs font-semibold text-[var(--color-healing-green)] hover:underline flex items-center gap-1"
                            >
                                <Check className="w-3 h-3" /> Mark all read
                            </button>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length > 0 ? (
                                <div className="divide-y divide-[var(--glass-border)]">
                                    {notifications.map(notification => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 transition-colors hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer flex gap-3 ${!notification.isRead ? 'bg-[var(--color-healing-green)]/5' : ''}`}
                                            onClick={() => {
                                                setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
                                            }}
                                        >
                                            <div className="mt-1 shrink-0 p-2 bg-[var(--bg-secondary)] rounded-full shadow-sm border border-[var(--glass-border)]">
                                                {getIconForType(notification.type, notification.message.en)}
                                            </div>
                                            <div>
                                                <h4 className={`text-sm ${!notification.isRead ? 'font-bold text-[var(--text-primary)]' : 'font-medium text-[var(--text-secondary)]'}`}>
                                                    {notification.title[currentLang] || notification.title.en}
                                                </h4>
                                                <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
                                                    {notification.message[currentLang] || notification.message.en}
                                                </p>
                                                <p className="text-[10px] text-[var(--text-secondary)] opacity-60 mt-2 uppercase tracking-wide">
                                                    Just now
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-[var(--text-secondary)] flex flex-col items-center">
                                    <Bell className="w-12 h-12 mx-auto mb-2 opacity-50 text-[#FFFFFF]" />
                                    <p className="text-sm font-semibold text-[#FFFFFF]">You're all caught up!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
