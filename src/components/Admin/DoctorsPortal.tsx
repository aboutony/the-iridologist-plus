import { useState } from 'react';
import type { UserProfile, Language, Supplement, Order } from '../../models/types';
import { Search, PlusCircle, CheckCircle, Languages, Clock, MessageSquare } from 'lucide-react';
import { PushNotificationAdmin } from './PushNotificationAdmin';

const mockPatients: UserProfile[] = [
    { id: 'p1', name: 'John Doe', phone: '71 123 456', country: 'Lebanon', countryCode: 'LB', otpVerified: true, language: 'en', subscription: 'Gold', hasIrisTestAccess: true },
    { id: 'p2', name: 'Marie Dupont', phone: '06 12 34 56 78', country: 'France', countryCode: 'FR', otpVerified: true, language: 'fr', subscription: 'Silver', hasIrisTestAccess: false },
];

const mockStore: Supplement[] = [
    { id: 's1', name: 'Vitamin D3 & K2', description: 'Immune support', type: 'Liquid', price: 45, weightGrams: 100 },
    { id: 's2', name: 'Omega 3 Fish Oil', description: 'Heart & Brain Health', type: 'Pill', price: 30, weightGrams: 200 }
];

const mockPayments: Order[] = [
    { id: 'o1', userId: 'p1', items: [], subtotal: 0, shippingFee: 0, total: 150, status: 'PendingPayment', receiptUrl: 'mock-url', paymentMethod: 'OMT', createdAt: '2026-02-20T10:00:00Z' }
];

export const DoctorsPortal: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'patients' | 'payments' | 'echoes'>('patients');
    const [selectedPatient, setSelectedPatient] = useState<UserProfile | null>(null);

    // Prescription State
    const [selectedSupplement, setSelectedSupplement] = useState<Supplement | null>(null);
    const [prescriptionTime, setPrescriptionTime] = useState('08:00');
    const [prescriptionNote, setPrescriptionNote] = useState('');
    const [isTranslating, setIsTranslating] = useState(false);
    const [translatedNotes, setTranslatedNotes] = useState<Record<Language, string> | null>(null);

    const handleTranslateMock = () => {
        if (!prescriptionNote) return;
        setIsTranslating(true);
        setTimeout(() => {
            setTranslatedNotes({
                en: prescriptionNote,
                fr: `[Auto-Translated (FR)] ${prescriptionNote}`,
                ar: `[مترجم آلياً (AR)] ${prescriptionNote}`
            });
            setIsTranslating(false);
        }, 1500);
    };

    const assignPrescription = () => {
        alert(`Assigned ${selectedSupplement?.name} to ${selectedPatient?.name} at ${prescriptionTime}. Notes added in EN, FR, AR.`);
        setPrescriptionNote('');
        setTranslatedNotes(null);
    };

    const renderPatientsViewer = () => (
        <div className="space-y-4 animate-fade-in">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                <input
                    type="text"
                    placeholder="Search verified patients..."
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[var(--color-healing-green)]"
                />
            </div>

            <div className="space-y-3">
                {mockPatients.map(patient => (
                    <div
                        key={patient.id}
                        onClick={() => setSelectedPatient(patient)}
                        className={`p-4 rounded-xl border flex justify-between items-center cursor-pointer transition-all ${selectedPatient?.id === patient.id
                            ? 'bg-[var(--color-healing-green)]/10 border-[var(--color-healing-green)] shadow-sm'
                            : 'glass-panel hover:bg-black/5 dark:hover:bg-white/5 border-[var(--glass-border)]'
                            }`}
                    >
                        <div>
                            <h4 className="font-semibold">{patient.name}</h4>
                            <p className="text-xs text-[var(--text-secondary)] flex gap-2">
                                <span>{patient.countryCode} • {patient.phone}</span>
                                <span className="uppercase font-bold text-[var(--color-gold)]">{patient.subscription} Tier</span>
                            </p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center font-bold text-xs uppercase text-[var(--color-healing-green)]">
                            {patient.language}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderPrescriptionUI = () => {
        if (!selectedPatient) return null;
        return (
            <div className="mt-8 glass-panel p-6 border-l-4 border-[var(--color-healing-green)] animate-fade-in space-y-5">
                <h3 className="font-heading text-lg font-semibold flex items-center justify-between">
                    <span>Treatment Protocol: {selectedPatient.name}</span>
                    <span className="text-xs px-2 py-1 bg-[var(--bg-secondary)] rounded shadow-sm border border-[var(--glass-border)] uppercase tracking-wide">
                        Preferred Language: {selectedPatient.language}
                    </span>
                </h3>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-[var(--text-secondary)]">1. Select Supplement from Store</label>
                        <select
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-healing-green)]"
                            onChange={(e) => setSelectedSupplement(mockStore.find(s => s.id === e.target.value) || null)}
                        >
                            <option value="">Select an item...</option>
                            {mockStore.map(s => <option key={s.id} value={s.id}>{s.name} ({s.type})</option>)}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-[var(--text-secondary)]">2. Set Daily Timetable</label>
                        <input
                            type="time"
                            value={prescriptionTime}
                            onChange={(e) => setPrescriptionTime(e.target.value)}
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-healing-green)]"
                        />
                    </div>

                    <div className="space-y-2 border-t border-[var(--glass-border)] pt-4 mt-2">
                        <label className="text-sm font-semibold text-[var(--text-secondary)] flex justify-between items-center">
                            <span>3. Clinical Notes (Admin Only)</span>
                            <button
                                onClick={handleTranslateMock}
                                disabled={!prescriptionNote || isTranslating}
                                className="flex items-center gap-1 text-xs text-[var(--color-healing-green)] bg-[var(--color-healing-green)]/10 px-2 py-1 rounded disabled:opacity-50 haptic-ripple"
                            >
                                {isTranslating ? <div className="w-3 h-3 border-2 border-[var(--color-healing-green)]/30 border-t-[var(--color-healing-green)] rounded-full animate-spin" /> : <Languages className="w-3 h-3" />}
                                Auto-Translate
                            </button>
                        </label>
                        <textarea
                            value={prescriptionNote}
                            onChange={(e) => setPrescriptionNote(e.target.value)}
                            placeholder="e.g. Take with a heavy meal to maximize absorption."
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl p-3 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-[var(--color-healing-green)]"
                        />
                        {translatedNotes && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-700/30 p-3 rounded-lg text-xs space-y-1">
                                <p className="font-semibold text-yellow-800 dark:text-yellow-500 mb-1 flex items-center justify-between">
                                    <span>Translations Ready for Patient View</span>
                                    <CheckCircle className="w-3 h-3" />
                                </p>
                                <p><strong>EN:</strong> {translatedNotes.en}</p>
                                <p><strong>FR:</strong> {translatedNotes.fr}</p>
                                <p><strong>AR:</strong> {translatedNotes.ar}</p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={assignPrescription}
                        disabled={!selectedSupplement || !translatedNotes}
                        className="w-full py-4 mt-4 rounded-xl font-semibold bg-[var(--color-healing-green)] text-white shadow-md hover:bg-[var(--color-healing-green-light)] disabled:opacity-50 disabled:cursor-not-allowed haptic-ripple flex justify-center items-center gap-2 transition-all block"
                    >
                        Assign to Patient Timetable <PlusCircle className="w-5 h-5" />
                    </button>
                </div>
            </div>
        );
    };

    const renderPendingPayments = () => (
        <div className="space-y-4 animate-fade-in">
            {mockPayments.map(order => (
                <div key={order.id} className="glass-panel p-4 flex flex-col gap-3 border-l-4 border-orange-400">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-semibold flex items-center gap-2">
                                Order #{order.id}
                                <span className="text-[10px] bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> Pending Review</span>
                            </h4>
                            <p className="text-xs text-[var(--text-secondary)] mt-1">Patient ID: {order.userId} • Method: <strong>{order.paymentMethod}</strong></p>
                        </div>
                        <span className="font-bold font-heading text-lg">${order.total}</span>
                    </div>

                    <div className="flex gap-2 mt-2">
                        <button className="flex-1 py-2 rounded-lg text-sm font-semibold bg-[var(--bg-secondary)] border border-[var(--glass-border)] text-[var(--text-secondary)] hover:bg-black/5 haptic-ripple transition-colors">
                            View Uploaded Receipt
                        </button>
                        <button className="flex-1 py-2 rounded-lg text-sm font-semibold bg-[var(--color-healing-green)] text-white shadow-sm hover:bg-[var(--color-healing-green-light)] haptic-ripple transition-colors">
                            Approve Payment
                        </button>
                    </div>
                </div>
            ))}
            {mockPayments.length === 0 && (
                <div className="text-center p-8 text-[var(--text-secondary)] opacity-50">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                    <p>No pending payments in queue.</p>
                </div>
            )}
        </div>
    );

    return (
        <div className="w-full max-w-2xl mx-auto p-4 lg:p-0">
            <div className="bg-[var(--bg-secondary)] p-2 rounded-2xl flex gap-2 mb-6 shadow-sm border border-[var(--glass-border)]">
                <button
                    onClick={() => setActiveTab('patients')}
                    className={`flex-1 py-3 px-2 rounded-xl text-xs md:text-sm font-semibold transition-all text-center haptic-ripple ${activeTab === 'patients' ? 'bg-[var(--color-healing-green)] text-white shadow-md' : 'text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5'}`}
                >
                    Patient Protocols
                </button>
                <button
                    onClick={() => setActiveTab('echoes')}
                    className={`flex-1 py-3 px-2 rounded-xl text-xs md:text-sm font-semibold transition-all text-center haptic-ripple ${activeTab === 'echoes' ? 'bg-[var(--color-healing-green)] text-white shadow-md' : 'text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5'}`}
                >
                    <span className="flex items-center justify-center gap-1"><MessageSquare className="w-4 h-4" /> Echoes</span>
                </button>
                <button
                    onClick={() => setActiveTab('payments')}
                    className={`flex-1 py-3 px-2 rounded-xl text-xs md:text-sm font-semibold transition-all text-center haptic-ripple relative ${activeTab === 'payments' ? 'bg-[var(--color-healing-green)] text-white shadow-md' : 'text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5'}`}
                >
                    Pending Payments
                    {mockPayments.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                </button>
            </div>

            {activeTab === 'patients' && (
                <>
                    {renderPatientsViewer()}
                    {renderPrescriptionUI()}
                </>
            )}

            {activeTab === 'payments' && renderPendingPayments()}

            {activeTab === 'echoes' && <PushNotificationAdmin />}
        </div>
    );
};
