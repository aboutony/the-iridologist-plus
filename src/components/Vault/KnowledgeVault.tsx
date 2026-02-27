import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, PlayCircle, Headphones, FileText, Video, Lock, Unlock, Filter } from 'lucide-react';
import type { MediaAsset, SymptomTag, SubscriptionTierType, Language } from '../../models/types';

const mockTags: SymptomTag[] = ['Anxiety', 'Digestion', 'Sugar Detox', 'Fatigue', 'Iridology 101'];

const mockMediaVault: MediaAsset[] = [
    {
        id: 'm1',
        title: { en: 'Understanding Iridology Basics', fr: 'Comprendre les Bases de l\'Iridologie', ar: 'فهم أساسيات علم القزحية' },
        description: { en: 'A beginner-friendly guide to analyzing irises.', fr: 'Un guide pour débutants sur l\'analyse des iris.', ar: 'دليل للمبتدئين لتحليل القزحية.' },
        type: 'Blog',
        tags: ['Iridology 101'],
        thumbnailUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80',
        mediaUrl: '#',
        requiredTier: 'Bronze',
        publishedAt: '2026-02-15T10:00:00Z'
    },
    {
        id: 'm2',
        title: { en: 'Deep Dive: Sugar Detox Masterclass', fr: 'Masterclass: Detox au Sucre', ar: 'درس متقدم: التخلص من سموم السكر' },
        description: { en: 'Dr. Philippe explains the 21-day timeline to eliminate sugar cravings.', fr: 'Le Dr Philippe explique le délai de 21 jours pour éliminer les envies de sucre.', ar: 'يشرح الدكتور فيليب الجدول الزمني للتخلص من الرغبة بتناول السكر في غضون 21 يومًا.' },
        type: 'Video',
        tags: ['Sugar Detox', 'Fatigue'],
        thumbnailUrl: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&q=80',
        mediaUrl: '#',
        requiredTier: 'Silver',
        publishedAt: '2026-02-18T14:30:00Z'
    },
    {
        id: 'm3',
        title: { en: 'Guided Meditation for Gut Health', fr: 'Méditation Guidée pour la Santé Intestinale', ar: 'تأمل موجه لصحة الأمعاء' },
        description: { en: 'Use this audio trace daily before meals to calm digestion anxiety.', fr: 'Utilisez cette trace audio quotidiennement avant les repas pour calmer l\'anxiété liée à la digestion.', ar: 'استخدم هذا المقطع الصوتي يوميًا قبل وجبات الطعام لتهدئة القلق المتعلق بالهضم.' },
        type: 'Audio',
        tags: ['Digestion', 'Anxiety'],
        thumbnailUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&q=80',
        mediaUrl: '#',
        requiredTier: 'Gold',
        publishedAt: '2026-02-20T08:00:00Z'
    }
];

export const KnowledgeVault: React.FC = () => {
    const { i18n } = useTranslation();
    const currentLang = i18n.language as Language;

    // Simulate user context
    const userTier = 'Silver' as SubscriptionTierType; // Mocking a Silver User

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<SymptomTag | 'All'>('All');

    const filteredMedia = mockMediaVault.filter(media => {
        const matchesSearch = media.title[currentLang].toLowerCase().includes(searchQuery.toLowerCase()) ||
            media.description[currentLang].toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag = selectedTag === 'All' || media.tags.includes(selectedTag);
        return matchesSearch && matchesTag;
    });

    const canAccess = (requiredTier: SubscriptionTierType) => {
        if (requiredTier === 'Bronze') return true;
        if (requiredTier === 'Silver' && (userTier === 'Silver' || userTier === 'Gold')) return true;
        if (requiredTier === 'Gold' && userTier === 'Gold') return true;
        return false;
    };

    const getIconForType = (type: string) => {
        switch (type) {
            case 'Video': return <Video className="w-4 h-4" />;
            case 'Audio': return <Headphones className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    return (
        <div className="w-full space-y-6 animate-fade-in">
            <div className="flex flex-col gap-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search symptoms, topics, or media..."
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[var(--color-healing-green)]"
                    />
                </div>

                <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
                    <button
                        onClick={() => setSelectedTag('All')}
                        className={`whitespace-nowrap px-4 py-2 flex items-center gap-2 rounded-full text-sm font-medium transition-all ${selectedTag === 'All' ? 'bg-[var(--color-healing-green)] text-white shadow-md' : 'glass-panel text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5'}`}
                    >
                        <Filter className="w-3 h-3" /> All Library
                    </button>
                    {mockTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedTag === tag ? 'bg-[var(--color-healing-green)] text-white shadow-md' : 'glass-panel text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5'}`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* User Status Banner */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl p-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-gold)]/10 flex items-center justify-center">
                        <Unlock className="w-5 h-5 text-[var(--color-gold)]" />
                    </div>
                    <div>
                        <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wide font-semibold">Current Access Level</p>
                        <p className="font-heading font-bold text-[var(--text-primary)]">{userTier} Tier</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredMedia.map(media => {
                    const hasAccess = canAccess(media.requiredTier);
                    return (
                        <div key={media.id} className="relative glass-panel rounded-2xl overflow-hidden group">
                            <div className="h-40 relative w-full bg-black/10">
                                <img src={media.thumbnailUrl} alt={media.title[currentLang]} className={`w-full h-full object-cover transition-transform duration-700 ${!hasAccess ? 'grayscale blur-sm opacity-50' : 'group-hover:scale-105'}`} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-2 py-1 rounded flex items-center gap-1 font-medium">
                                    {getIconForType(media.type)} {media.type}
                                </div>

                                {!hasAccess ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                        <div className="bg-[var(--bg-secondary)] p-3 rounded-full mb-2 shadow-lg">
                                            <Lock className="w-6 h-6 text-[var(--color-gold)]" />
                                        </div>
                                        <span className="text-white font-semibold text-sm bg-black/60 px-3 py-1 rounded-full uppercase tracking-wide">
                                            {media.requiredTier} Tier Required
                                        </span>
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="bg-[var(--color-healing-green)]/90 p-4 rounded-full text-white cursor-pointer hover:scale-110 transition-transform shadow-lg haptic-ripple">
                                            <PlayCircle className="w-8 h-8" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <div className="flex gap-2 mb-2 flex-wrap">
                                    {media.tags.map(tag => (
                                        <span key={tag} className="text-[10px] bg-[var(--color-healing-green)]/10 text-[var(--color-healing-green)] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h3 className="font-heading font-bold text-lg mb-1 line-clamp-1">{media.title[currentLang] || media.title.en}</h3>
                                <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{media.description[currentLang] || media.description.en}</p>
                            </div>
                        </div>
                    );
                })}

                {filteredMedia.length === 0 && (
                    <div className="text-center p-8 text-[var(--text-secondary)]">
                        <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No health content found matching your filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
