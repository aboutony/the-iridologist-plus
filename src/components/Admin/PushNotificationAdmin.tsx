import React, { useState } from 'react';
import { Send, Image, MessageSquare } from 'lucide-react';

export const PushNotificationAdmin: React.FC = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [targetSegment, setTargetSegment] = useState('All');
    const [isSending, setIsSending] = useState(false);
    const [sentObj, setSentObj] = useState<{ title: string, segment: string } | null>(null);

    const handleSendPush = () => {
        if (!title || !message) return;
        setIsSending(true);
        setTimeout(() => {
            setIsSending(false);
            setSentObj({ title, segment: targetSegment });
            setTitle('');
            setMessage('');
        }, 1500);
    }

    return (
        <div className="glass-panel p-6 mt-8 animate-fade-in border-t-4 border-blue-500">
            <h3 className="font-heading text-lg font-semibold flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-blue-500" /> Push "Echoes" & Insights
            </h3>

            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-[var(--text-secondary)]">Target Segment</label>
                    <select
                        value={targetSegment}
                        onChange={(e) => setTargetSegment(e.target.value)}
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="All">All Active Patients</option>
                        <option value="Gold">Gold Tier (Premium)</option>
                        <option value="Bronze">Bronze Tier (Basic)</option>
                        <option value="Pending">Pending Verification</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-semibold text-[var(--text-secondary)]">Echo Title (Internal EN, translates auto)</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Importance of Morning Sunlight"
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-semibold text-[var(--text-secondary)]">Message Body</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type out the daily insight to push to user lockscreens..."
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex gap-2 items-center p-3 rounded-xl border border-dashed border-[var(--glass-border)] bg-[var(--bg-secondary)] cursor-pointer hover:bg-black/5 text-[var(--text-secondary)] transition-colors">
                    <Image className="w-5 h-5" />
                    <span className="text-sm font-semibold">Attach Media/Image (Optional)</span>
                </div>

                <button
                    onClick={handleSendPush}
                    disabled={!title || !message || isSending}
                    className="w-full py-4 mt-2 rounded-xl font-semibold bg-blue-600 text-white shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed haptic-ripple flex justify-center items-center gap-2 transition-all"
                >
                    {isSending ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="w-5 h-5" /> Broadcast Echo</>}
                </button>

                {sentObj && (
                    <div className="mt-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm flex items-center justify-between animate-fade-in">
                        <span>Successfully pushed <strong>{sentObj.title}</strong> to {sentObj.segment}.</span>
                    </div>
                )}
            </div>
        </div>
    )
}
