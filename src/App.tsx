import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Eye, Moon, Sun, Bell, Shield,
    Activity, BookOpen, Play, ShoppingBag,
    Pill, Apple,
    Sunrise, Sunset, MoonStar,
    ChevronRight, Upload, Send,
    Camera, Calendar, Lock, CreditCard,
    Clock, CheckCircle2, AlertCircle,
    DollarSign, Users, FileText, X,
    ChefHat, ArrowLeftRight, Plus,
    Aperture, CircleDot, Scan, Timer,
    BellRing, CalendarCheck, MessageSquare,
    Video, Monitor, Truck, Weight, Globe, MapPin
} from 'lucide-react';
import './index.css';

// ============================================
//  TRILINGUAL TEXT MAP
// ============================================
type Lang = 'en' | 'fr' | 'ar';

const T: Record<string, Record<Lang, string>> = {
    appName: { en: 'The Iridologist', fr: "L'Iridologue", ar: 'أخصائي القزحية' },
    tagline: { en: 'Clinical Iris Analysis', fr: "Analyse Clinique de l'Iris", ar: 'تحليل القزحية السريري' },
    phone: { en: 'Mobile Number', fr: 'Numéro de Mobile', ar: 'رقم الجوال' },
    phonePh: { en: 'Enter your number', fr: 'Entrez votre numéro', ar: 'أدخل رقمك' },
    sendOtp: { en: 'Send Verification Code', fr: 'Envoyer le Code', ar: 'إرسال رمز التحقق' },
    otpTitle: { en: 'Enter Verification Code', fr: 'Entrez le Code', ar: 'أدخل رمز التحقق' },
    otpSub: { en: 'We sent a 4-digit code to your phone', fr: 'Code à 4 chiffres envoyé', ar: 'أرسلنا رمزاً من 4 أرقام' },
    verify: { en: 'Verify & Enter', fr: 'Vérifier & Entrer', ar: 'تحقق وادخل' },
    resend: { en: 'Resend Code', fr: 'Renvoyer le Code', ar: 'إعادة إرسال الرمز' },
    country: { en: 'Country', fr: 'Pays', ar: 'البلد' },
    fullName: { en: 'Full Name', fr: 'Nom Complet', ar: 'الاسم الكامل' },
    namePh: { en: 'e.g. Ahmad Khoury', fr: 'ex. Ahmad Khoury', ar: 'مثال: أحمد خوري' },
    vitality: { en: 'Vitality', fr: 'Vitalité', ar: 'الحيوية' },
    journey: { en: 'Journey', fr: 'Parcours', ar: 'الرحلة' },
    vault: { en: 'Vault', fr: 'Coffre', ar: 'الخزنة' },
    store: { en: 'Store', fr: 'Boutique', ar: 'المتجر' },
};

const tx = (key: string, lang: Lang) => T[key]?.[lang] || T[key]?.en || key;

// ============================================
//  COUNTRIES
// ============================================
const countries = [
    { code: '+961', name: 'Lebanon', abbr: 'LEB', flag: '🇱🇧' },
    { code: '+966', name: 'Saudi Arabia', abbr: 'SAU', flag: '🇸🇦' },
    { code: '+971', name: 'UAE', abbr: 'UAE', flag: '🇦🇪' },
    { code: '+33', name: 'France', abbr: 'FRA', flag: '🇫🇷' },
    { code: '+1', name: 'USA', abbr: 'USA', flag: '🇺🇸' },
];

// ============================================
//  SMART FILE ID
// ============================================
function generateFileId(name: string, countryCode: string): string {
    const parts = name.trim().split(/\s+/);
    const initials = parts.map(p => p.charAt(0).toUpperCase()).join('').slice(0, 2) || 'XX';
    const country = countries.find(c => c.code === countryCode);
    const abbr = country?.abbr || 'INT';
    const now = new Date();
    const quarter = Math.ceil((now.getMonth() + 1) / 3);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${initials}-${abbr}-Q${quarter}${month}-001`;
}

// ============================================
//  MEAL TYPE
// ============================================
type MealSlot = { period: string; protein: string; nutrients: string[]; iconType: 'morning' | 'noon' | 'evening' };

const DEFAULT_MEALS: MealSlot[] = [
    { period: 'Morning', iconType: 'morning', protein: 'Eggs', nutrients: ['B12'] },
    { period: 'Noon', iconType: 'noon', protein: 'Fish', nutrients: ['Magnesium'] },
    { period: 'Evening', iconType: 'evening', protein: 'Chicken', nutrients: [] },
];

// ============================================
//  VITALITY STATE MACHINE
// ============================================
type VitalityState = 'locked' | 'camera' | 'review' | 'ready' | 'dashboard';
type AppointmentStatus = 'none' | 'pending' | 'confirmed';

// ============================================
//  APP
// ============================================
type Page = 'gateway' | 'vitality' | 'journey' | 'vault' | 'store';

const App: React.FC = () => {
    const { i18n } = useTranslation();
    const [lang, setLang] = useState<Lang>('en');
    const [page, setPage] = useState<Page>('gateway');
    const [dark, setDark] = useState(false);

    // Gateway
    const [fullName, setFullName] = useState('');
    const [countryCode, setCountryCode] = useState('+961');
    const [phoneNum, setPhoneNum] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '']);

    const fileId = useMemo(() => generateFileId(fullName || 'Ahmad Khoury', countryCode), [fullName, countryCode]);

    // Payment gates
    const [payGate, setPayGate] = useState<{ title: string; amount: number; desc: string } | null>(null);
    const [gateStatus, setGateStatus] = useState<'form' | 'pending'>('form');
    const [visitPaid, setVisitPaid] = useState(false);

    // Vitality state machine
    const [vitalityState, setVitalityState] = useState<VitalityState>('locked');

    // Dr. Philippe calendar
    const [blockedDays, setBlockedDays] = useState<Set<number>>(new Set([7, 14]));

    // Program sync
    const [activeProgram, setActiveProgram] = useState<MealSlot[] | null>(null);
    const [programLocked, setProgramLocked] = useState(false);

    // Appointment tracking
    const [appointmentStatus, setAppointmentStatus] = useState<AppointmentStatus>('none');
    const [selectedBookingDay, setSelectedBookingDay] = useState<number | null>(null);

    // Dr. Philippe notifications
    const [drNotifications, setDrNotifications] = useState<{ id: string; type: string; fileId: string; time: string; read: boolean }[]>([]);

    useEffect(() => {
        document.body.style.background = dark ? '#000508' : '#C8CDD3';
    }, [dark]);

    const toggleTheme = () => setDark(d => !d);
    const changeLang = (l: Lang) => { setLang(l); i18n.changeLanguage(l); };
    const handleSendOtp = () => { if (phoneNum.length >= 6 && fullName.trim().length >= 2) setOtpSent(true); };

    const handleOtpChange = (idx: number, val: string) => {
        if (val.length > 1) return;
        const next = [...otp];
        next[idx] = val;
        setOtp(next);
        if (val && idx < 3) document.getElementById(`otp-${idx + 1}`)?.focus();
    };

    const handleVerify = () => { if (otp.every(d => d !== '')) setPage('vitality'); };
    const isRtl = lang === 'ar';
    const frameClass = `phone-frame ${dark ? 'dark' : ''}`;

    const openPayGate = (title: string, amount: number, desc: string) => {
        setPayGate({ title, amount, desc });
        setGateStatus('form');
    };

    const submitPayGate = () => {
        setGateStatus('pending');
        if (payGate && payGate.amount === 250) {
            setTimeout(() => setVitalityState('camera'), 300);
        }
        if (payGate && payGate.amount === 150) {
            setVisitPaid(true);
            setAppointmentStatus('pending');
            setDrNotifications(prev => [...prev, {
                id: `notif-${Date.now()}`, type: 'appointment_pending',
                fileId, time: 'Just now', read: false
            }]);
        }
    };

    const handleIrisCaptured = () => { setVitalityState('review'); };

    // Dr. Philippe: Send Appointment Request → patient goes from review → ready
    const sendReadyNotification = () => { setVitalityState('ready'); };

    // Dr. Philippe: Confirm Appointment → blue card on vitality
    const confirmAppointment = () => {
        setAppointmentStatus('confirmed');
        setVitalityState('dashboard');
    };

    const toggleBlockDay = (day: number) => {
        setBlockedDays(prev => {
            const next = new Set(prev);
            if (next.has(day)) next.delete(day); else next.add(day);
            return next;
        });
    };

    const handleLockProgram = (meals: MealSlot[]) => {
        setActiveProgram(meals);
        setProgramLocked(true);
    };

    // ========================================
    //  PAYMENT GATE MODAL
    // ========================================
    const PaymentGateModal = () => {
        if (!payGate) return null;
        return (
            <div className="gate-overlay">
                <div className="gate-modal">
                    <button className="gate-close" onClick={() => setPayGate(null)}><X size={18} /></button>
                    {gateStatus === 'form' ? (
                        <>
                            <div className="gate-icon-wrap"><CreditCard size={24} color="#007AFF" /></div>
                            <h2 className="gate-title">{payGate.title}</h2>
                            <p className="gate-desc">{payGate.desc}</p>
                            <div className="gate-amount">${payGate.amount}.00</div>
                            <div className="gate-form">
                                <label className="gw-label">Card Number</label>
                                <input className="gate-input" placeholder="4242 4242 4242 4242" maxLength={19} />
                                <div className="gate-row">
                                    <div style={{ flex: 1 }}>
                                        <label className="gw-label">Expiry</label>
                                        <input className="gate-input" placeholder="MM/YY" maxLength={5} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label className="gw-label">CVC</label>
                                        <input className="gate-input" placeholder="123" maxLength={3} />
                                    </div>
                                </div>
                                <button className="blue-btn" style={{ marginTop: 8 }} onClick={submitPayGate}>
                                    <Lock size={14} /> Pay ${payGate.amount}.00
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="gate-pending">
                            <div className="gate-pending-icon"><Clock size={32} color="#007AFF" /></div>
                            <h2 className="gate-title">{payGate.amount === 250 ? 'Payment Approved' : 'Awaiting Admin Approval'}</h2>
                            <p className="gate-desc">
                                {payGate.amount === 250
                                    ? 'Your iris scan camera has been unlocked. Close this to begin your scan.'
                                    : <>Your payment of <strong>${payGate.amount}.00</strong> has been submitted. Dr. Philippe will review shortly.</>
                                }
                            </p>
                            <div className="gate-status-badge">
                                {payGate.amount === 250
                                    ? <><CheckCircle2 size={14} /> Approved</>
                                    : <><AlertCircle size={14} /> Pending Review</>
                                }
                            </div>
                            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 12 }}>File ID: {fileId}</p>
                            <button className="blue-btn" style={{ marginTop: 16 }} onClick={() => setPayGate(null)}>
                                {payGate.amount === 250 ? 'Open Camera' : 'Done'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // ========================================
    //  UNIFIED GATEWAY
    // ========================================
    if (page === 'gateway') {
        return (
            <div className={frameClass} dir={isRtl ? 'rtl' : 'ltr'}>
                <div className="gw-header">
                    <div className="gw-header-left"><Shield size={16} color="#007AFF" /></div>
                    <span className="gw-header-title">{tx('appName', lang)}</span>
                    <div className="gw-header-right">
                        <button className="theme-btn" onClick={toggleTheme}>
                            {dark ? <Sun size={14} /> : <Moon size={14} />}
                        </button>
                    </div>
                </div>
                <div className="gw-body">
                    <div className="gw-logo"><Eye size={28} color="#FFFFFF" strokeWidth={2} /></div>
                    <h1 className="gw-title">{tx('appName', lang)}</h1>
                    <p className="gw-subtitle">{tx('tagline', lang)}</p>
                    {!otpSent ? (
                        <div className="gw-form">
                            <label className="gw-label">{tx('fullName', lang)}</label>
                            <input className="gate-input" placeholder={tx('namePh', lang)}
                                value={fullName} onChange={e => setFullName(e.target.value)} />
                            <label className="gw-label">{tx('country', lang)}</label>
                            <select className="gw-select" value={countryCode} onChange={e => setCountryCode(e.target.value)}>
                                {countries.map(c => (
                                    <option key={c.code} value={c.code}>{c.flag} {c.name} ({c.code})</option>
                                ))}
                            </select>
                            <label className="gw-label">{tx('phone', lang)}</label>
                            <div className="gw-phone-row">
                                <span className="gw-country-code">{countryCode}</span>
                                <input className="gw-phone-input" type="tel" placeholder={tx('phonePh', lang)}
                                    value={phoneNum} onChange={e => setPhoneNum(e.target.value.replace(/\D/g, ''))} maxLength={12} />
                            </div>
                            {fullName.trim().length >= 2 && (
                                <div className="file-id-preview">
                                    <FileText size={12} /> Your File ID: <strong>{fileId}</strong>
                                </div>
                            )}
                            <button className="blue-btn" onClick={handleSendOtp}
                                disabled={phoneNum.length < 6 || fullName.trim().length < 2}>
                                <Send size={16} /> {tx('sendOtp', lang)}
                            </button>
                        </div>
                    ) : (
                        <div className="gw-form">
                            <p className="gw-otp-title">{tx('otpTitle', lang)}</p>
                            <p className="gw-otp-sub">{tx('otpSub', lang)}</p>
                            <div className="gw-otp-row">
                                {otp.map((digit, i) => (
                                    <input key={i} id={`otp-${i}`} className="gw-otp-box" type="text" inputMode="numeric"
                                        maxLength={1} value={digit} onChange={e => handleOtpChange(i, e.target.value)} autoFocus={i === 0} />
                                ))}
                            </div>
                            <button className="blue-btn" onClick={handleVerify}>
                                <Shield size={16} /> {tx('verify', lang)}
                            </button>
                            <button className="gw-resend" onClick={() => setOtpSent(false)}>{tx('resend', lang)}</button>
                        </div>
                    )}
                </div>
                <div className="gw-lang-bar">
                    <button className={`gw-lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => changeLang('en')}>EN</button>
                    <button className={`gw-lang-btn ${lang === 'fr' ? 'active' : ''}`} onClick={() => changeLang('fr')}>FR</button>
                    <button className={`gw-lang-btn ${lang === 'ar' ? 'active' : ''}`} onClick={() => changeLang('ar')}>AR</button>
                </div>
            </div>
        );
    }

    // ========================================
    //  APP SHELL
    // ========================================
    const titles: Record<string, { main: string; sub: string }> = {
        vitality: { main: tx('vitality', lang), sub: tx('tagline', lang) },
        journey: { main: tx('journey', lang), sub: tx('tagline', lang) },
        vault: { main: tx('vault', lang), sub: tx('tagline', lang) },
        store: { main: tx('store', lang), sub: tx('tagline', lang) },
    };

    return (
        <div className={frameClass} dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="app-header">
                <div className="header-left"><Bell size={18} color={dark ? '#94A3B8' : '#64748B'} /></div>
                <div style={{ textAlign: 'center' }}>
                    <h1>{titles[page]?.main}</h1>
                    <p>{titles[page]?.sub}</p>
                </div>
                <div className="header-right">
                    <button className="theme-btn" onClick={toggleTheme}>
                        {dark ? <Sun size={14} /> : <Moon size={14} />}
                    </button>
                </div>
            </div>

            <div className="app-content">
                {page === 'vitality' && (
                    <VitalityPage
                        dark={dark}
                        state={vitalityState}
                        onOpenGate={openPayGate}
                        onCapture={handleIrisCaptured}
                        fileId={fileId}
                        appointmentStatus={appointmentStatus}
                        selectedBookingDay={selectedBookingDay}
                        blockedDays={blockedDays}
                        visitPaid={visitPaid}
                        onBookDay={(day: number) => setSelectedBookingDay(day)}
                    />
                )}
                {page === 'journey' && (
                    <JourneyPage
                        visitPaid={visitPaid}
                        blockedDays={blockedDays}
                        onOpenGate={openPayGate}
                        activeProgram={activeProgram}
                        programLocked={programLocked}
                        fileId={fileId}
                    />
                )}
                {page === 'vault' && (
                    <VaultPage
                        fileId={fileId}
                        blockedDays={blockedDays}
                        onToggleBlock={toggleBlockDay}
                        onLockProgram={handleLockProgram}
                        programLocked={programLocked}
                        vitalityState={vitalityState}
                        onSendReady={sendReadyNotification}
                        appointmentStatus={appointmentStatus}
                        onConfirmAppointment={confirmAppointment}
                        drNotifications={drNotifications}
                    />
                )}
                {page === 'store' && <StorePage />}
            </div>

            <div className="bottom-nav">
                <NavTab icon={<Activity size={18} />} label={tx('vitality', lang)} active={page === 'vitality'} onClick={() => setPage('vitality')} />
                <NavTab icon={<BookOpen size={18} />} label={tx('journey', lang)} active={page === 'journey'} onClick={() => setPage('journey')} />
                <NavTab icon={<Play size={18} />} label={tx('vault', lang)} active={page === 'vault'} onClick={() => setPage('vault')} />
                <NavTab icon={<ShoppingBag size={18} />} label={tx('store', lang)} active={page === 'store'} onClick={() => setPage('store')} />
            </div>

            <PaymentGateModal />
        </div>
    );
};

// ============================================
//  NAV TAB
// ============================================
const NavTab: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
    <button className={`nav-tab ${active ? 'active' : ''}`} onClick={onClick}>
        {icon}<span>{label}</span>
    </button>
);

// ============================================
//  VITALITY — State Machine
// ============================================
const VitalityPage: React.FC<{
    dark: boolean;
    state: VitalityState;
    onOpenGate: (t: string, a: number, d: string) => void;
    onCapture: () => void;
    fileId: string;
    appointmentStatus: AppointmentStatus;
    selectedBookingDay: number | null;
    blockedDays: Set<number>;
    visitPaid: boolean;
    onBookDay: (day: number) => void;
}> = ({ dark, state, onOpenGate, onCapture, fileId, appointmentStatus, selectedBookingDay, blockedDays, visitPaid, onBookDay }) => {

    if (state === 'locked') {
        return (
            <div className="page-body" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div className="gate-full-lock">
                    <div className="gate-full-icon"><Camera size={32} color="#007AFF" /></div>
                    <h2 className="gate-title">Iris Scan Required</h2>
                    <p className="gate-desc">Your Vitality dashboard will be unlocked after Dr. Philippe completes your clinical iris analysis.</p>
                    <div className="gate-fee-tag"><DollarSign size={14} /> One-Time Fee: $250.00</div>
                    <button className="gate-lock-btn" style={{ marginTop: 20 }}
                        onClick={() => onOpenGate('Iris Scan Analysis', 250, 'Unlock your personalized Vitality dashboard with a comprehensive iris analysis by Dr. Philippe.')}>
                        <Lock size={14} /> Unlock Vitality — $250.00
                    </button>
                </div>
            </div>
        );
    }

    if (state === 'camera') return <IrisCameraUI onCapture={onCapture} fileId={fileId} />;
    if (state === 'review') return <UnderReviewUI fileId={fileId} />;

    // STATE: READY TO BOOK (Milestone 3→4)
    if (state === 'ready') {
        const today = new Date();
        const calDays: { day: number; dow: string; available: boolean }[] = [];
        const dows = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (let i = 1; i <= 14; i++) {
            const d = new Date(today); d.setDate(today.getDate() + i);
            const isWknd = d.getDay() === 0 || d.getDay() === 6;
            calDays.push({ day: d.getDate(), dow: dows[d.getDay()], available: !isWknd && !blockedDays.has(d.getDate()) });
        }
        return (
            <div className="page-body">
                <div className="ready-banner">
                    <CalendarCheck size={18} color="#007AFF" />
                    <div><p className="card-title" style={{ marginBottom: 2 }}>Ready to Book First Visit</p>
                        <p className="card-text">Dr. Philippe has reviewed your iris scan and approved you for consultation.</p></div>
                </div>
                <div className="card" style={{ marginTop: 8 }}>
                    <div className="gate-card-header" style={{ marginBottom: 12 }}>
                        <div className="gate-card-icon"><Calendar size={18} color="#007AFF" /></div>
                        <div><p className="card-title" style={{ marginBottom: 2 }}>Select Your Date</p>
                            <p className="card-text">Only dates Dr. Philippe is available are shown</p></div>
                    </div>
                    <div className="cal-grid">
                        {calDays.map((d, i) => (
                            <button key={i} className={`cal-day ${d.available ? '' : 'disabled'} ${selectedBookingDay === d.day ? 'selected' : ''}`}
                                onClick={() => d.available && onBookDay(d.day)} disabled={!d.available}>
                                <span className="cal-dow">{d.dow}</span><span className="cal-num">{d.day}</span>
                            </button>
                        ))}
                    </div>
                    {selectedBookingDay && (
                        <div className="cal-selected-info"><Calendar size={14} color="#007AFF" /><span>Selected: {selectedBookingDay}th — 10:00 AM</span></div>
                    )}
                    {visitPaid ? (
                        <div className="gate-status-inline pending" style={{ marginTop: 12 }}><Clock size={14} /> Awaiting Dr. Philippe's Confirmation</div>
                    ) : (
                        <button className="gate-lock-btn" style={{ marginTop: 12 }} disabled={!selectedBookingDay}
                            onClick={() => onOpenGate('First Visit Booking', 150, 'Book your first in-person consultation with Dr. Philippe.')}>
                            <Lock size={14} /> Confirm Booking — $150.00
                        </button>
                    )}
                </div>
                <div className="card free-checkup-card">
                    <div className="gate-card-header">
                        <div className="gate-card-icon" style={{ background: 'rgba(34,197,94,0.1)' }}><CheckCircle2 size={18} color="#22C55E" /></div>
                        <div><p className="card-title" style={{ marginBottom: 2 }}>Weekly Checkups</p>
                            <p className="card-text" style={{ color: '#22C55E', fontWeight: 600 }}>Included in Treatment — $0</p></div>
                    </div>
                    <p className="card-text" style={{ marginTop: 8 }}>After your first visit, all weekly checkups are included free of charge.</p>
                </div>
            </div>
        );
    }

    // STATE: DASHBOARD
    const [checkupMode, setCheckupMode] = useState<'online' | 'inperson'>('online');
    return (
        <div className="page-body">
            {appointmentStatus === 'confirmed' && (
                <div className="confirmed-card">
                    <CalendarCheck size={20} color="#007AFF" />
                    <div>
                        <p className="confirmed-title">Appointment Confirmed</p>
                        <p className="confirmed-sub">Dr. Philippe · {selectedBookingDay ? `${selectedBookingDay}th` : 'TBD'} at 10:00 AM</p>
                        <p className="confirmed-id">{fileId}</p>
                    </div>
                </div>
            )}

            {/* Weekly Checkup Portal (Step 8) */}
            {appointmentStatus === 'confirmed' && (
                <div className="card checkup-portal">
                    <p className="card-title" style={{ marginBottom: 8 }}>Weekly Checkup</p>
                    <div className="checkup-toggle">
                        <button className={`checkup-opt ${checkupMode === 'online' ? 'active' : ''}`} onClick={() => setCheckupMode('online')}>
                            <Video size={14} /> Join Online
                        </button>
                        <button className={`checkup-opt ${checkupMode === 'inperson' ? 'active' : ''}`} onClick={() => setCheckupMode('inperson')}>
                            <Monitor size={14} /> In-Person
                        </button>
                    </div>
                    {checkupMode === 'online' ? (
                        <div className="checkup-info">
                            <p className="card-text">Video consultation with Dr. Philippe via secure link.</p>
                            <button className="blue-btn" style={{ marginTop: 8 }}><Video size={14} /> Launch Session</button>
                        </div>
                    ) : (
                        <div className="checkup-info">
                            <p className="card-text">Visit the clinic for an in-person examination.</p>
                            <div className="checkup-detail"><MapPin size={12} color="#007AFF" /> Beirut Clinic · Hamra St.</div>
                            <div className="checkup-detail"><Clock size={12} color="#007AFF" /> Next available: Monday, 10:00 AM</div>
                        </div>
                    )}
                    <p className="checkup-free"><CheckCircle2 size={12} color="#22C55E" /> Included in Treatment — $0</p>
                </div>
            )}

            <div className="card ring-card">
                <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke={dark ? '#1E3050' : '#F1F5F9'} strokeWidth="10" />
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#007AFF" strokeWidth="10"
                        strokeDasharray={`${2 * Math.PI * 50 * 0.72} ${2 * Math.PI * 50 * 0.28}`}
                        strokeLinecap="round" transform="rotate(-90 60 60)" />
                </svg>
                <span className="ring-label">72%</span>
                <span className="ring-sublabel">Adherence Rate</span>
            </div>
            <p className="section-title">Timetable</p>
            <TaskItem icon={<Pill size={18} />} name="Vitamin D3 & K2" time="08:00 AM · 2 Drops" />
            <TaskItem icon={<Apple size={18} />} name="Anti-inflammatory Smoothie" time="08:30 AM" />
            <TaskItem icon={<Pill size={18} />} name="Omega 3 Fish Oil" time="01:00 PM · 1 Capsule" />
        </div>
    );
};

// ============================================
//  IRIS CAMERA UI (Milestone 1)
// ============================================
const IrisCameraUI: React.FC<{ onCapture: () => void; fileId: string }> = ({ onCapture, fileId }) => {
    const [capturing, setCapturing] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleCapture = () => {
        setCapturing(true);
        setProgress(0);
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => onCapture(), 500);
                    return 100;
                }
                return prev + 2;
            });
        }, 40);
    };

    return (
        <div className="page-body iris-cam-page">
            {/* Camera Viewport */}
            <div className="iris-viewport">
                {/* Background gradient simulating camera feed */}
                <div className="iris-cam-bg" />

                {/* Precision Overlay */}
                <div className="iris-overlay">
                    {/* Outer ring */}
                    <svg className="iris-svg" viewBox="0 0 280 280">
                        {/* Grid crosshairs */}
                        <line x1="140" y1="20" x2="140" y2="260" stroke="rgba(0,122,255,0.15)" strokeWidth="0.5" />
                        <line x1="20" y1="140" x2="260" y2="140" stroke="rgba(0,122,255,0.15)" strokeWidth="0.5" />

                        {/* Outer guide ring */}
                        <circle cx="140" cy="140" r="120" fill="none" stroke="rgba(0,122,255,0.2)" strokeWidth="1" strokeDasharray="8 4" />

                        {/* Main alignment ring */}
                        <circle cx="140" cy="140" r="90" fill="none" stroke="#007AFF" strokeWidth="2" />

                        {/* Inner precision ring */}
                        <circle cx="140" cy="140" r="55" fill="none" stroke="rgba(0,122,255,0.5)" strokeWidth="1" strokeDasharray="4 4" />

                        {/* Pupil center */}
                        <circle cx="140" cy="140" r="18" fill="none" stroke="rgba(0,122,255,0.6)" strokeWidth="1.5" />
                        <circle cx="140" cy="140" r="3" fill="#007AFF" />

                        {/* Corner brackets */}
                        <path d="M55 70 L55 55 L70 55" fill="none" stroke="#007AFF" strokeWidth="2" />
                        <path d="M210 55 L225 55 L225 70" fill="none" stroke="#007AFF" strokeWidth="2" />
                        <path d="M225 210 L225 225 L210 225" fill="none" stroke="#007AFF" strokeWidth="2" />
                        <path d="M70 225 L55 225 L55 210" fill="none" stroke="#007AFF" strokeWidth="2" />

                        {/* Degree markers */}
                        {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
                            const rad = (deg * Math.PI) / 180;
                            const x1 = 140 + 95 * Math.cos(rad);
                            const y1 = 140 + 95 * Math.sin(rad);
                            const x2 = 140 + 85 * Math.cos(rad);
                            const y2 = 140 + 85 * Math.sin(rad);
                            return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#007AFF" strokeWidth="1.5" />;
                        })}

                        {/* Progress arc when capturing */}
                        {capturing && (
                            <circle cx="140" cy="140" r="90" fill="none" stroke="#22C55E" strokeWidth="3"
                                strokeDasharray={`${2 * Math.PI * 90 * (progress / 100)} ${2 * Math.PI * 90}`}
                                strokeLinecap="round" transform="rotate(-90 140 140)" />
                        )}
                    </svg>
                </div>

                {/* Status indicators */}
                <div className="iris-status-bar">
                    <div className="iris-indicator">
                        <CircleDot size={10} color={capturing ? '#22C55E' : '#007AFF'} />
                        <span>{capturing ? 'Scanning...' : 'Align Eye'}</span>
                    </div>
                    <div className="iris-indicator">
                        <Aperture size={10} /> <span>12MP</span>
                    </div>
                    <div className="iris-indicator">
                        <Scan size={10} /> <span>HDR</span>
                    </div>
                </div>
            </div>

            {/* Info Panel */}
            <div className="iris-info-panel">
                <p className="iris-info-title">
                    <Eye size={14} color="#007AFF" /> Iris Scan — {fileId}
                </p>
                <p className="iris-info-text">
                    Position your eye within the blue ring. Hold steady for auto-capture.
                </p>

                {capturing ? (
                    <div className="iris-progress-bar">
                        <div className="iris-progress-fill" style={{ width: `${progress}%` }} />
                        <span className="iris-progress-label">{progress < 100 ? `Analyzing... ${progress}%` : 'Complete!'}</span>
                    </div>
                ) : (
                    <button className="iris-capture-btn" onClick={handleCapture}>
                        <div className="iris-capture-ring">
                            <Camera size={20} color="#FFFFFF" />
                        </div>
                        <span>Capture Iris</span>
                    </button>
                )}
            </div>

            {/* Quality indicators */}
            <div className="iris-quality-row">
                <div className="iris-q-chip active"><span>Focus</span><span className="q-val">98%</span></div>
                <div className="iris-q-chip active"><span>Light</span><span className="q-val">Good</span></div>
                <div className="iris-q-chip"><span>Stable</span><span className="q-val">Hold</span></div>
            </div>
        </div>
    );
};

// ============================================
//  UNDER REVIEW UI (Milestone 2)
// ============================================
const UnderReviewUI: React.FC<{ fileId: string }> = ({ fileId }) => {
    // 14-day countdown
    const [days] = useState(14);
    const [hours] = useState(0);
    const [mins] = useState(0);

    return (
        <div className="page-body" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div className="review-container">
                <div className="review-icon-ring">
                    <svg width="100" height="100" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(0,122,255,0.1)" strokeWidth="6" />
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#007AFF" strokeWidth="6"
                            strokeDasharray={`${2 * Math.PI * 42 * 0.0}`} strokeLinecap="round" transform="rotate(-90 50 50)" />
                    </svg>
                    <Timer size={28} color="#007AFF" className="review-icon-center" />
                </div>

                <h2 className="gate-title">Under Review</h2>
                <p className="review-subtitle">by Dr. Philippe</p>
                <p className="gate-desc">
                    Your iris scan has been submitted for clinical analysis. Results will be available within 14 days.
                </p>

                {/* Countdown */}
                <div className="countdown-grid">
                    <div className="countdown-box">
                        <span className="countdown-num">{days}</span>
                        <span className="countdown-label">Days</span>
                    </div>
                    <div className="countdown-sep">:</div>
                    <div className="countdown-box">
                        <span className="countdown-num">{String(hours).padStart(2, '0')}</span>
                        <span className="countdown-label">Hours</span>
                    </div>
                    <div className="countdown-sep">:</div>
                    <div className="countdown-box">
                        <span className="countdown-num">{String(mins).padStart(2, '0')}</span>
                        <span className="countdown-label">Min</span>
                    </div>
                </div>

                <div className="review-file-tag">
                    <FileText size={12} /> {fileId}
                </div>

                <div className="gate-status-badge" style={{ marginTop: 16 }}>
                    <Clock size={14} /> Analysis in Progress
                </div>
            </div>
        </div>
    );
};

// ============================================
//  JOURNEY — Milestone 4 + Synced Program
// ============================================
const JourneyPage: React.FC<{
    visitPaid: boolean;
    blockedDays: Set<number>;
    onOpenGate: (t: string, a: number, d: string) => void;
    activeProgram: MealSlot[] | null;
    programLocked: boolean;
    fileId: string;
}> = ({ visitPaid, blockedDays, onOpenGate, activeProgram, programLocked, fileId }) => {
    const milestones = [
        { id: 1, label: 'Onboarding', done: true },
        { id: 2, label: 'Iris Scan', done: true },
        { id: 3, label: 'Protocol', done: true },
        { id: 4, label: 'First Visit', done: false, current: true },
        { id: 5, label: 'Ongoing Care', done: false },
    ];

    const today = new Date();
    const calDays: { day: number; dow: string; available: boolean }[] = [];
    const dows = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 1; i <= 14; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const isWeekend = d.getDay() === 0 || d.getDay() === 6;
        const isBlocked = blockedDays.has(d.getDate());
        calDays.push({ day: d.getDate(), dow: dows[d.getDay()], available: !isWeekend && !isBlocked });
    }

    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    // Meals to display: synced program or defaults
    const displayMeals = activeProgram || DEFAULT_MEALS;
    const mealIcon = (type: string) => {
        if (type === 'morning') return <Sunrise size={14} color="#F59E0B" />;
        if (type === 'noon') return <Sunset size={14} color="#F97316" />;
        return <MoonStar size={14} color="#6366F1" />;
    };
    const mealTimes: Record<string, string> = { Morning: '08:00 AM', Noon: '01:00 PM', Evening: '07:00 PM' };

    return (
        <div className="page-body">
            <p className="section-title">Treatment Milestones</p>
            <div className="milestone-track">
                {milestones.map(m => (
                    <div key={m.id} className={`milestone ${m.done ? 'done' : ''} ${m.current ? 'current' : ''}`}>
                        <div className="milestone-dot">
                            {m.done ? <CheckCircle2 size={14} color="#FFFFFF" /> : <span>{m.id}</span>}
                        </div>
                        <span className="milestone-label">{m.label}</span>
                    </div>
                ))}
                <div className="milestone-line" />
            </div>

            {/* Synced Program Banner */}
            {programLocked && (
                <div className="program-synced-banner">
                    <CheckCircle2 size={14} color="#22C55E" />
                    <span>Diet synced from Dr. Philippe — {fileId}</span>
                </div>
            )}

            {/* Daily Diet (synced from program wizard) */}
            <p className="section-title">Daily Diet</p>
            {displayMeals.map((meal, i) => (
                <div key={i} className="task-item">
                    <div className="task-icon">{mealIcon(meal.iconType)}</div>
                    <div className="task-info">
                        <span className="task-name">{meal.protein}{meal.nutrients.length > 0 ? ` + ${meal.nutrients.join(', ')}` : ''}</span>
                        <span className="task-time">{mealTimes[meal.period] || '12:00 PM'} · {meal.period}</span>
                    </div>
                    <button className="task-action">✓</button>
                </div>
            ))}

            {/* Calendar */}
            <div className="card" style={{ marginTop: 8 }}>
                <div className="gate-card-header" style={{ marginBottom: 12 }}>
                    <div className="gate-card-icon"><Calendar size={18} color="#007AFF" /></div>
                    <div>
                        <p className="card-title" style={{ marginBottom: 2 }}>Book First Visit</p>
                        <p className="card-text">Schedule your consultation with Dr. Philippe</p>
                    </div>
                </div>
                <div className="cal-grid">
                    {calDays.map((d, i) => (
                        <button key={i}
                            className={`cal-day ${d.available ? '' : 'disabled'} ${selectedDay === d.day ? 'selected' : ''}`}
                            onClick={() => d.available && setSelectedDay(d.day)} disabled={!d.available}>
                            <span className="cal-dow">{d.dow}</span>
                            <span className="cal-num">{d.day}</span>
                        </button>
                    ))}
                </div>
                {selectedDay && (
                    <div className="cal-selected-info"><Calendar size={14} color="#007AFF" /><span>Selected: {selectedDay}th — 10:00 AM</span></div>
                )}
                {visitPaid ? (
                    <div className="gate-status-inline pending" style={{ marginTop: 12 }}><Clock size={14} /> Awaiting Admin Approval</div>
                ) : (
                    <button className="gate-lock-btn" style={{ marginTop: 12 }}
                        onClick={() => onOpenGate('First Visit Booking', 150, 'Book your first in-person consultation with Dr. Philippe. One-time clinical assessment fee.')}>
                        <Lock size={14} /> Book — $150.00 Consultation Fee
                    </button>
                )}
            </div>

            <div className="card free-checkup-card">
                <div className="gate-card-header">
                    <div className="gate-card-icon" style={{ background: 'rgba(34,197,94,0.1)' }}><CheckCircle2 size={18} color="#22C55E" /></div>
                    <div>
                        <p className="card-title" style={{ marginBottom: 2 }}>Weekly Checkups</p>
                        <p className="card-text" style={{ color: '#22C55E', fontWeight: 600 }}>Included in Treatment — $0</p>
                    </div>
                </div>
                <p className="card-text" style={{ marginTop: 8 }}>Once your First Visit is confirmed, all subsequent weekly checkups are included at no cost.</p>
            </div>
        </div>
    );
};

// ============================================
//  VAULT — File ID + Dr. Philippe Dashboard
// ============================================
const VaultPage: React.FC<{
    fileId: string;
    blockedDays: Set<number>;
    onToggleBlock: (day: number) => void;
    onLockProgram: (meals: MealSlot[]) => void;
    programLocked: boolean;
    vitalityState: VitalityState;
    onSendReady: () => void;
    appointmentStatus: AppointmentStatus;
    onConfirmAppointment: () => void;
    drNotifications: { id: string; type: string; fileId: string; time: string; read: boolean }[];
}> = ({ fileId, blockedDays, onToggleBlock, onLockProgram, programLocked, vitalityState, onSendReady, appointmentStatus, onConfirmAppointment, drNotifications }) => {
    const [drTab, setDrTab] = useState<'financials' | 'wizard' | 'calendar' | 'notifications'>('financials');

    return (
        <div className="page-body">
            <div className="card file-id-card">
                <div className="file-id-badge"><FileText size={12} color="#007AFF" /><span>Patient File</span></div>
                <div className="file-id-value">{fileId}</div>
                <p className="card-text" style={{ marginTop: 6 }}>Your unique clinical file identifier.</p>
            </div>

            {/* One-Month Roadmap (Step 7) */}
            <div className="card roadmap-card">
                <div className="roadmap-header">
                    <div className="roadmap-icon"><BookOpen size={18} color="#007AFF" /></div>
                    <div>
                        <p className="card-title" style={{ marginBottom: 2 }}>One-Month Treatment Roadmap</p>
                        <p className="card-text">Signed by Dr. Philippe · {fileId}</p>
                    </div>
                </div>
                <div className="roadmap-body">
                    {[1, 2, 3, 4].map(week => (
                        <div key={week} className="roadmap-week">
                            <p className="roadmap-week-title">Week {week}</p>
                            <div className="roadmap-row">
                                <div className="roadmap-slot"><Sunrise size={12} color="#F59E0B" /><span>Morning</span></div>
                                <span className="roadmap-val">Nakhala Bread + <strong>B12</strong></span>
                            </div>
                            <div className="roadmap-row">
                                <div className="roadmap-slot"><Sunset size={12} color="#F97316" /><span>Noon</span></div>
                                <span className="roadmap-val">Fish + <strong>Magnesium</strong></span>
                            </div>
                            <div className="roadmap-row">
                                <div className="roadmap-slot"><MoonStar size={12} color="#6366F1" /><span>Evening</span></div>
                                <span className="roadmap-val">Chicken + Leafy Greens</span>
                            </div>
                            {week <= 2 && (
                                <div className="roadmap-note">📋 Focus: Liver detox + hydration (2L/day)</div>
                            )}
                            {week > 2 && (
                                <div className="roadmap-note">📋 Focus: Immune rebalance + sleep optimization</div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="roadmap-signature">
                    <div className="roadmap-sig-line">
                        <span className="roadmap-sig-name">Dr. Philippe Mounir</span>
                        <span className="roadmap-sig-title">Clinical Iridologist</span>
                    </div>
                    <div className="roadmap-sig-stamp"><Shield size={12} color="#007AFF" /> Verified</div>
                </div>
            </div>

            <p className="section-title">Dr. Philippe Dashboard</p>
            <div className="dr-tabs">
                <button className={`dr-tab ${drTab === 'financials' ? 'active' : ''}`} onClick={() => setDrTab('financials')}>
                    <DollarSign size={14} /> Financials
                </button>
                <button className={`dr-tab ${drTab === 'wizard' ? 'active' : ''}`} onClick={() => setDrTab('wizard')}>
                    <ChefHat size={14} /> Program
                </button>
                <button className={`dr-tab ${drTab === 'calendar' ? 'active' : ''}`} onClick={() => setDrTab('calendar')}>
                    <Calendar size={14} /> Calendar
                </button>
                <button className={`dr-tab ${drTab === 'notifications' ? 'active' : ''}`} onClick={() => setDrTab('notifications')}>
                    <BellRing size={14} /> Alerts
                    {(vitalityState === 'review' || appointmentStatus === 'pending') && <span className="dr-tab-badge" />}
                </button>
            </div>

            {drTab === 'financials' && <FinancialsTab fileId={fileId} />}
            {drTab === 'wizard' && <ProgramWizardTab onLockProgram={onLockProgram} programLocked={programLocked} fileId={fileId} />}
            {drTab === 'calendar' && <CalendarControlTab blockedDays={blockedDays} onToggleBlock={onToggleBlock} />}
            {drTab === 'notifications' && (
                <div className="card practitioner-card">
                    <div className="gate-card-header" style={{ marginBottom: 12 }}>
                        <div className="gate-card-icon"><MessageSquare size={18} color="#007AFF" /></div>
                        <div><p className="card-title" style={{ marginBottom: 0 }}>Patient Notifications</p></div>
                    </div>

                    {/* Step 3: Send Appointment Request */}
                    {vitalityState === 'review' && (
                        <div className="notif-action-card">
                            <div className="notif-action-icon"><CalendarCheck size={18} color="#007AFF" /></div>
                            <div style={{ flex: 1 }}>
                                <p className="card-title" style={{ marginBottom: 2 }}>Iris Review Complete</p>
                                <p className="card-text">Patient {fileId} is ready for booking.</p>
                            </div>
                            <button className="blue-btn" style={{ padding: '8px 14px', fontSize: 11 }} onClick={onSendReady}>
                                <Send size={12} /> Send Appointment Request
                            </button>
                        </div>
                    )}

                    {vitalityState === 'ready' && appointmentStatus === 'none' && (
                        <div className="notif-status-card sent">
                            <CheckCircle2 size={14} color="#22C55E" />
                            <span>Appointment request sent to patient. Waiting for booking.</span>
                        </div>
                    )}

                    {/* Step 5-6: Confirm Appointment */}
                    {appointmentStatus === 'pending' && (
                        <div className="notif-action-card" style={{ borderColor: 'rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.05)' }}>
                            <div className="approval-dot" style={{ width: 10, height: 10 }} />
                            <div style={{ flex: 1 }}>
                                <p className="card-title" style={{ marginBottom: 2 }}>Appointment Pending</p>
                                <p className="card-text">{fileId} · Booking submitted</p>
                            </div>
                            <button className="blue-btn" style={{ padding: '8px 14px', fontSize: 11 }} onClick={onConfirmAppointment}>
                                <CheckCircle2 size={12} /> Confirm
                            </button>
                        </div>
                    )}

                    {appointmentStatus === 'confirmed' && (
                        <div className="notif-status-card sent">
                            <CheckCircle2 size={14} color="#22C55E" />
                            <span>Appointment confirmed for patient {fileId}.</span>
                        </div>
                    )}

                    {drNotifications.length > 0 && (
                        <>
                            <p className="card-title" style={{ marginTop: 14, marginBottom: 8 }}>Recent Activity</p>
                            {drNotifications.map(n => (
                                <div key={n.id} className="approval-item">
                                    <div className="approval-dot" />
                                    <div className="task-info">
                                        <span className="task-name">{n.type === 'appointment_pending' ? 'Booking Request' : n.type}</span>
                                        <span className="task-time">{n.fileId} · {n.time}</span>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

// ============================================
//  FINANCIALS TAB
// ============================================
const FinancialsTab: React.FC<{ fileId: string }> = ({ fileId }) => (
    <div className="card practitioner-card">
        <div className="gate-card-header" style={{ marginBottom: 12 }}>
            <div className="gate-card-icon"><Users size={18} color="#007AFF" /></div>
            <div><p className="card-title" style={{ marginBottom: 0 }}>Dr. Philippe — Earnings</p></div>
        </div>
        <div className="fin-grid">
            <div className="fin-box"><DollarSign size={16} color="#007AFF" /><span className="fin-amount">$400.00</span><span className="fin-label">Total Earned</span></div>
            <div className="fin-box"><AlertCircle size={16} color="#F59E0B" /><span className="fin-amount">2</span><span className="fin-label">Pending</span></div>
        </div>
        <div className="fin-breakdown">
            <div className="fin-line"><span>Iris Scan Fee</span><span className="fin-line-amt">$250.00</span></div>
            <div className="fin-line"><span>First Visit Fee</span><span className="fin-line-amt">$150.00</span></div>
            <div className="fin-line total"><span>Total</span><span className="fin-line-amt">$400.00</span></div>
        </div>
        <p className="card-title" style={{ marginTop: 14, marginBottom: 8 }}>Pending Approvals</p>
        <div className="approval-item">
            <div className="approval-dot" /><div className="task-info"><span className="task-name">Iris Scan — $250</span><span className="task-time">{fileId} · Submitted 2h ago</span></div>
            <button className="task-action">Review</button>
        </div>
        <div className="approval-item">
            <div className="approval-dot" /><div className="task-info"><span className="task-name">First Visit — $150</span><span className="task-time">{fileId} · Submitted 30m ago</span></div>
            <button className="task-action">Review</button>
        </div>
    </div>
);

// ============================================
//  PROGRAM WIZARD — Push to Patient
// ============================================
const ProgramWizardTab: React.FC<{
    onLockProgram: (meals: MealSlot[]) => void;
    programLocked: boolean;
    fileId: string;
}> = ({ onLockProgram, programLocked, fileId }) => {
    const [meals, setMeals] = useState<MealSlot[]>([...DEFAULT_MEALS]);
    const proteinOptions = ['Eggs', 'Fish', 'Chicken', 'Tofu', 'Lentils', 'Nakhala Bread', 'Beef'];
    const nutrientOptions = ['B12', 'Magnesium', 'Iron', 'Zinc', 'Vitamin D', 'Omega 3'];

    const swapProtein = (idx: number) => {
        setMeals(prev => {
            const next = [...prev];
            const cur = proteinOptions.indexOf(next[idx].protein);
            next[idx] = { ...next[idx], protein: proteinOptions[(cur + 1) % proteinOptions.length] };
            return next;
        });
    };

    const addNutrient = (mi: number, n: string) => {
        setMeals(prev => {
            const next = [...prev];
            if (!next[mi].nutrients.includes(n)) next[mi] = { ...next[mi], nutrients: [...next[mi].nutrients, n] };
            return next;
        });
    };

    const removeNutrient = (mi: number, n: string) => {
        setMeals(prev => {
            const next = [...prev];
            next[mi] = { ...next[mi], nutrients: next[mi].nutrients.filter(x => x !== n) };
            return next;
        });
    };

    const [addingTo, setAddingTo] = useState<number | null>(null);

    const mealIcons = {
        morning: <Sunrise size={16} color="#F59E0B" />,
        noon: <Sunset size={16} color="#F97316" />,
        evening: <MoonStar size={16} color="#6366F1" />,
    };

    return (
        <div className="card practitioner-card">
            <div className="gate-card-header" style={{ marginBottom: 12 }}>
                <div className="gate-card-icon"><ChefHat size={18} color="#007AFF" /></div>
                <div>
                    <p className="card-title" style={{ marginBottom: 2 }}>Meal Program Builder</p>
                    <p className="card-text">For patient {fileId}</p>
                </div>
            </div>

            {programLocked && (
                <div className="program-synced-banner" style={{ marginBottom: 12 }}>
                    <CheckCircle2 size={14} color="#22C55E" />
                    <span>Program locked & pushed to patient</span>
                </div>
            )}

            {meals.map((meal, i) => (
                <div key={i} className="meal-slot">
                    <div className="meal-header">
                        <div className="meal-period">{mealIcons[meal.iconType]}<span className="meal-period-label">{meal.period}</span></div>
                    </div>
                    <div className="meal-protein-row">
                        <span className="meal-protein-label">Protein:</span>
                        <span className="meal-protein-value">{meal.protein}</span>
                        {!programLocked && (
                            <button className="meal-swap-btn" onClick={() => swapProtein(i)}><ArrowLeftRight size={12} /> Swap</button>
                        )}
                    </div>
                    <div className="meal-nutrients">
                        {meal.nutrients.map(n => (
                            <span key={n} className="nutrient-tag">
                                {n}
                                {!programLocked && <button className="nutrient-remove" onClick={() => removeNutrient(i, n)}>×</button>}
                            </span>
                        ))}
                        {!programLocked && (
                            <button className="nutrient-add-btn" onClick={() => setAddingTo(addingTo === i ? null : i)}><Plus size={12} /></button>
                        )}
                    </div>
                    {addingTo === i && !programLocked && (
                        <div className="nutrient-picker">
                            {nutrientOptions.filter(n => !meal.nutrients.includes(n)).map(n => (
                                <button key={n} className="nutrient-option" onClick={() => { addNutrient(i, n); setAddingTo(null); }}>{n}</button>
                            ))}
                        </div>
                    )}
                </div>
            ))}

            {!programLocked ? (
                <button className="blue-btn" style={{ marginTop: 12 }} onClick={() => onLockProgram(meals)}>
                    <Lock size={14} /> Lock & Push to Patient
                </button>
            ) : (
                <div className="gate-status-inline pending" style={{ marginTop: 12 }}><CheckCircle2 size={14} /> Program Active</div>
            )}
        </div>
    );
};

// ============================================
//  CALENDAR CONTROL
// ============================================
const CalendarControlTab: React.FC<{
    blockedDays: Set<number>;
    onToggleBlock: (day: number) => void;
}> = ({ blockedDays, onToggleBlock }) => {
    const today = new Date();
    const calDays: { day: number; dow: string; isWeekend: boolean }[] = [];
    const dows = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 1; i <= 21; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        calDays.push({ day: d.getDate(), dow: dows[d.getDay()], isWeekend: d.getDay() === 0 || d.getDay() === 6 });
    }

    return (
        <div className="card practitioner-card">
            <div className="gate-card-header" style={{ marginBottom: 12 }}>
                <div className="gate-card-icon"><Calendar size={18} color="#007AFF" /></div>
                <div><p className="card-title" style={{ marginBottom: 2 }}>Availability Manager</p>
                    <p className="card-text">Tap dates to toggle Off / Available</p></div>
            </div>
            <div className="cal-grid cal-grid-ctrl">
                {calDays.map((d, i) => {
                    const isBlocked = blockedDays.has(d.day);
                    return (
                        <button key={i} className={`cal-day ${d.isWeekend ? 'weekend' : ''} ${isBlocked ? 'blocked' : ''}`}
                            onClick={() => !d.isWeekend && onToggleBlock(d.day)}>
                            <span className="cal-dow">{d.dow}</span>
                            <span className="cal-num">{d.day}</span>
                            {isBlocked && !d.isWeekend && <span className="cal-off-badge">OFF</span>}
                        </button>
                    );
                })}
            </div>
            <div className="cal-legend">
                <span className="cal-legend-item"><span className="cal-legend-dot available" /> Available</span>
                <span className="cal-legend-item"><span className="cal-legend-dot blocked" /> Blocked</span>
                <span className="cal-legend-item"><span className="cal-legend-dot weekend" /> Weekend</span>
            </div>
        </div>
    );
};

// ============================================
//  STORE
// ============================================
const StorePage: React.FC = () => {
    const [step, setStep] = useState<'cart' | 'payment'>('cart');
    const [payMethod, setPayMethod] = useState('CreditCard');
    const [shipCountry, setShipCountry] = useState('Lebanon');
    const [totalWeight] = useState(300); // grams
    const cartTotal = 120;
    const shippingCost = shipCountry === 'Lebanon' ? 5 : totalWeight > 500 ? 25 : 15;
    const grandTotal = cartTotal + shippingCost;

    return (
        <div className="page-body">
            {step === 'cart' ? (
                <>
                    <p className="card-title">Your Cart</p>
                    <div className="card" style={{ display: 'flex', flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                        <div className="task-icon"><ShoppingBag size={18} /></div>
                        <div className="task-info"><span className="task-name">Vitamin D3 & K2</span><span className="task-time">Liquid · 100g · Qty: 2</span></div>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>$90</span>
                    </div>
                    <div className="card" style={{ display: 'flex', flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                        <div className="task-icon"><ShoppingBag size={18} /></div>
                        <div className="task-info"><span className="task-name">Omega 3 Fish Oil</span><span className="task-time">Pill · 200g · Qty: 1</span></div>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>$30</span>
                    </div>

                    {/* Shipping Calculator (Step 11) */}
                    <div className="card shipping-calc">
                        <div className="gate-card-header" style={{ marginBottom: 10 }}>
                            <div className="gate-card-icon"><Truck size={16} color="#007AFF" /></div>
                            <div><p className="card-title" style={{ marginBottom: 2 }}>Shipping</p>
                                <p className="card-text">Weight-based delivery calculator</p></div>
                        </div>
                        <label className="gw-label">Delivery Country</label>
                        <select className="gw-select" value={shipCountry} onChange={e => setShipCountry(e.target.value)}>
                            <option value="Lebanon">🇱🇧 Lebanon (Domestic)</option>
                            <option value="UAE">🇦🇪 UAE</option>
                            <option value="Saudi Arabia">🇸🇦 Saudi Arabia</option>
                            <option value="France">🇫🇷 France</option>
                            <option value="USA">🇺🇸 USA</option>
                        </select>
                        <div className="ship-row">
                            <span><Weight size={12} /> Total Weight: {totalWeight}g</span>
                            <span className="ship-cost">{shipCountry === 'Lebanon' ? <><MapPin size={10} /> Domestic</> : <><Globe size={10} /> International</>}</span>
                        </div>
                        <div className="ship-fee">Shipping: <strong>${shippingCost}.00</strong></div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid var(--border-card)', marginTop: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>Total</span>
                        <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>${grandTotal}.00</span>
                    </div>
                    <button className="blue-btn" onClick={() => setStep('payment')}>Proceed to Payment <ChevronRight size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /></button>
                </>
            ) : (
                <>
                    <p className="card-title">Payment Method</p>
                    <div className="payment-tabs">
                        {['CreditCard', 'Whish', 'OMT', 'WesternUnion'].map(m => (
                            <button key={m} className={`payment-tab ${payMethod === m ? 'active' : ''}`} onClick={() => setPayMethod(m)}>
                                {m === 'CreditCard' ? <><CreditCard size={12} /> Card</> : m}
                            </button>
                        ))}
                    </div>

                    {payMethod === 'CreditCard' ? (
                        <div className="card">
                            <p className="card-title">Credit / Debit Card</p>
                            <div className="gate-form">
                                <label className="gw-label">Card Number</label>
                                <input className="gate-input" placeholder="4242 4242 4242 4242" maxLength={19} />
                                <div className="gate-row">
                                    <div style={{ flex: 1 }}><label className="gw-label">Expiry</label><input className="gate-input" placeholder="MM/YY" maxLength={5} /></div>
                                    <div style={{ flex: 1 }}><label className="gw-label">CVC</label><input className="gate-input" placeholder="123" maxLength={3} /></div>
                                </div>
                                <button className="blue-btn" style={{ marginTop: 8 }}>
                                    <Lock size={14} /> Pay ${grandTotal}.00
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="card"><p className="card-title">Transfer to: {payMethod}</p><p className="card-text">Send ${grandTotal}.00 to the account below, then upload your receipt.</p></div>
                            <div className="upload-box">
                                <Upload size={28} color="#94A3B8" /><p className="upload-title">Upload Payment Receipt</p><p className="upload-sub">JPEG, PNG, or PDF up to 5MB</p>
                                <button className="upload-btn">Choose File</button>
                            </div>
                            <button className="blue-btn">Submit Receipt for Review</button>
                        </>
                    )}
                    <button className="link-btn" onClick={() => setStep('cart')}>← Back to Cart</button>
                </>
            )}
        </div>
    );
};

// ============================================
//  REUSABLE
// ============================================
const TaskItem: React.FC<{ icon: React.ReactNode; name: string; time: string }> = ({ icon, name, time }) => (
    <div className="task-item">
        <div className="task-icon">{icon}</div>
        <div className="task-info"><span className="task-name">{name}</span><span className="task-time">{time}</span></div>
        <button className="task-action">Take</button>
    </div>
);

export default App;

