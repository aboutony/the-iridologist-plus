import React, { useState, useEffect } from 'react';
import { Globe, CheckCircle2, Eye, Languages, Smartphone, ArrowRight, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const mockCountries = [
    { code: 'LB', name: 'Lebanon', dialCode: '+961' },
    { code: 'FR', name: 'France', dialCode: '+33' },
    { code: 'AE', name: 'UAE', dialCode: '+971' },
    { code: 'SA', name: 'Saudi Arabia', dialCode: '+966' },
    { code: 'US', name: 'United States', dialCode: '+1' },
];

interface AuthShellProps {
    onComplete?: () => void;
}

export const AuthShell: React.FC<AuthShellProps> = ({ onComplete }) => {
    const { t, i18n } = useTranslation();
    const [step, setStep] = useState(0); // 0 = Language, 1 = Identity, 2 = Verification
    const [selectedCountry, setSelectedCountry] = useState(mockCountries[0]);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [focusedIdx, setFocusedIdx] = useState<number | null>(null);

    useEffect(() => {
        setSelectedCountry(mockCountries[0]);
    }, []);

    const handleLanguageSelect = (lang: string) => {
        i18n.changeLanguage(lang);
        setStep(1);
    };

    const handleSendOTP = () => {
        if (phone.length < 6) return;
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setStep(2);
        }, 1500);
    };

    const handleVerifyOTP = () => {
        if (otp.join('').length < 6) return;
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setStep(3); // Success/Profile creation
            // After showing success briefly, advance to Dashboard
            setTimeout(() => {
                onComplete?.();
            }, 1500);
        }, 1500);
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) value = value.slice(0, 1);
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full min-h-[85vh] max-w-[400px] mx-auto relative flex flex-col items-center justify-around py-6 gap-8"
        >
            {step === 0 && (
                <div className="flex flex-col items-center justify-start w-full min-h-[100dvh] animate-fade-in px-6 pt-[6vh] pb-12 relative">

                    {/* Circular Blue Eye Logo */}
                    <div className="relative flex justify-center items-center mb-8">
                        <div className="absolute inset-0 bg-[#3B82F6] rounded-full blur-[24px] opacity-30 scale-[1.2] w-[64px] h-[64px] mx-auto"></div>
                        <div className="bg-[#007BFF] rounded-full w-[64px] h-[64px] flex items-center justify-center relative z-10 shadow-[0_6px_14px_rgba(31,111,255,0.35)] border border-white/10">
                            <Eye className="w-7 h-7 text-white stroke-[2.5]" />
                        </div>
                    </div>

                    {/* Typography Group */}
                    <div className="text-center w-full mb-10">
                        <h1 className="text-[28px] font-heading text-[var(--text-primary)] font-bold leading-[1.15] tracking-tight">
                            Select Your<br />Language
                        </h1>
                        <p className="text-[var(--text-secondary)] text-[13px] font-clinical max-w-[260px] mx-auto leading-relaxed mt-4">
                            Choose your preferred language to begin your iridology analysis.
                        </p>
                    </div>

                    {/* Language Buttons — 16px gap, full width, 56px height */}
                    <div className="w-full flex flex-col max-w-[342px] z-10 gap-4">
                        <button onClick={() => handleLanguageSelect('en')} className="w-full h-[56px] btn-premium-blue flex items-center justify-center gap-3 px-5 text-[17px] rounded-xl">
                            <Globe className="w-5 h-5 opacity-90" />
                            <span className="font-semibold tracking-wide">English</span>
                        </button>

                        <button onClick={() => handleLanguageSelect('fr')} className="w-full h-[56px] btn-premium-blue flex items-center justify-center gap-3 px-5 text-[17px] rounded-xl">
                            <Languages className="w-5 h-5 opacity-90" />
                            <span className="font-semibold tracking-wide">Français</span>
                        </button>

                        <button onClick={() => handleLanguageSelect('ar')} className="w-full h-[56px] btn-premium-blue flex items-center justify-center gap-3 px-5 text-[17px] rounded-xl" dir="ltr">
                            <span className="font-semibold tracking-wide">العربية</span>
                            <Globe className="w-5 h-5 opacity-90" />
                        </button>
                    </div>

                    {/* Thin Blue Accent Line */}
                    <div className="mx-auto w-[80px] h-[2px] bg-[#007BFF]/40 rounded-full mt-10"></div>
                </div>
            )}

            {
                step === 1 && (
                    <div className="flex flex-col items-center justify-start w-full min-h-[100dvh] bg-[#020B1A] animate-fade-in relative z-20">

                        {/* Top Logo and Title Group */}
                        <div className="flex flex-col items-center gap-4 w-full pt-[60px]">
                            {/* Glowing Blue Eye Icon */}
                            <div className="relative flex justify-center items-center">
                                <div className="absolute inset-0 bg-[#3B82F6] rounded-full blur-[16px] opacity-40 scale-[1.2] w-[48px] h-[48px] mx-auto"></div>
                                <div className="bg-[#007BFF] rounded-full w-[48px] h-[48px] flex items-center justify-center relative z-10 shadow-[0_4px_12px_rgba(31,111,255,0.4)] border border-white/10">
                                    <Eye className="w-6 h-6 text-white stroke-[2.5]" />
                                </div>
                            </div>
                            {/* 'The Iridologist' in Pure White Serif */}
                            <h2 className="text-[20px] font-heading font-bold text-[#FFFFFF] tracking-widest uppercase">
                                THE IRIDOLOGIST
                            </h2>
                        </div>

                        {/* Centering Wrapper for Floating Card & Button */}
                        <div className="flex-1 w-full flex flex-col items-center justify-center pb-[150px]">
                            {/* The Floating Card (Shadow Box) */}
                            <div className="w-[90%] max-w-[400px] bg-[#0B1A2E] border border-[#1E3A5F] rounded-[24px] shadow-2xl p-[20px] flex flex-col relative">

                                {/* Card Titles */}
                                <div className="flex flex-col items-center text-center mb-[40px] gap-[20px]">
                                    <h3 className="text-[#FFFFFF] text-[26px] font-bold leading-none">Verify Identity</h3>
                                    <p className="text-[#A0B0C0] text-[13px] leading-relaxed max-w-[260px]">
                                        Please enter your details to securely access your iridology records
                                    </p>
                                </div>

                                {/* Input Fields */}
                                <div className="flex flex-col gap-[40px] w-full">
                                    {/* Country Field */}
                                    <div className="flex flex-col gap-[20px]">
                                        <label className="text-[#2563EB] text-[11px] font-bold uppercase tracking-wider block leading-none">COUNTRY</label>
                                        <div className="relative w-full h-[56px] bg-[#05101E] rounded-[12px] flex items-center px-4 overflow-hidden mt-[20px]">
                                            <Globe className="w-5 h-5 text-[#2563EB] drop-shadow-[0_0_10px_rgba(37,99,235,0.8)] shrink-0 mr-[20px]" />
                                            <select
                                                value={selectedCountry.code}
                                                onChange={(e) => setSelectedCountry(mockCountries.find(c => c.code === e.target.value) || mockCountries[0])}
                                                className="w-full h-full bg-transparent text-[#A0B0C0] text-[15px] appearance-none border-none focus:outline-none focus:ring-0 cursor-pointer pr-8"
                                            >
                                                <option value="" disabled hidden>United States (+1)</option>
                                                {mockCountries.map(c => (
                                                    <option key={c.code} value={c.code} className="bg-[#0A1628] text-white">
                                                        {c.name} ({c.dialCode})
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="w-5 h-5 text-[#FFFFFF] pointer-events-none absolute right-4 shrink-0" />
                                        </div>
                                    </div>

                                    {/* Phone Number Field */}
                                    <div className="flex flex-col gap-[20px]">
                                        <label className="text-[#2563EB] text-[11px] font-bold uppercase tracking-wider block leading-none">PHONE NUMBER</label>
                                        <div className="relative w-full h-[56px] bg-[#05101E] rounded-[12px] flex items-center px-4 overflow-hidden">
                                            <Smartphone className="w-5 h-5 text-[#2563EB] drop-shadow-[0_0_10px_rgba(37,99,235,0.8)] shrink-0 mr-[20px]" />
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="(555) 000-0000"
                                                className="w-full h-full bg-transparent text-[#FFFFFF] text-[15px] border-none focus:outline-none focus:ring-0 placeholder:text-[#A0B0C0]"
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Extracted Action Button & Footer Container */}
                        <div className="w-[90%] max-w-[400px] mt-[40px] -translate-y-[6cm] flex flex-col items-center">
                            <button
                                onClick={handleSendOTP}
                                disabled={phone.length < 6 || isLoading}
                                style={{
                                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
                                }}
                                className="w-full h-[56px] bg-gradient-to-t from-[#1E40AF] to-[#3B82F6] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-[12px] flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span className="text-[#FFFFFF] text-[16px] font-bold tracking-wide">Send OTP</span>
                                        <ArrowRight className="w-5 h-5 text-[#FFFFFF]" />
                                    </>
                                )}
                            </button>

                            {/* Terms and Conditions Footer (1cm below button) */}
                            <div className="mt-[40px] w-full flex justify-center px-4">
                                <p className="text-[#FFFFFF] opacity-80 text-[11px] text-center max-w-[280px] leading-relaxed">
                                    By continuing, you agree to our <a href="#" className="underline hover:opacity-100 transition-opacity">Terms of Service</a> & <a href="#" className="underline hover:opacity-100 transition-opacity">Privacy Policy</a>
                                </p>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                step === 2 && (
                    <div
                        className="flex flex-col items-center justify-between w-full h-[100vh] absolute inset-0 animate-fade-in z-30 p-8 pt-12 overflow-y-auto"
                        style={{
                            background: 'radial-gradient(circle at 50% 40%, #0a1b33 0%, #020b1a 100%)',
                            color: 'white',
                        }}
                    >
                        <div className="w-full flex flex-col items-center">
                            <button onClick={() => setStep(1)} className="self-start text-white text-3xl mb-10 bg-transparent border-none outline-none p-0 flex items-center justify-center leading-none hover:text-gray-300 transition-colors">
                                <span style={{ fontSize: '28px', lineHeight: 1 }}>←</span>
                            </button>

                            <div
                                className="p-5 mb-10 rounded-[20px]"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    boxShadow: '0 0 30px rgba(37, 99, 235, 0.25)',
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>

                            <h1 className="text-4xl font-bold tracking-tight mb-[20px]">Verification Code</h1>
                            <p className="text-[#a8c7fa] text-center text-[15px] px-4 leading-relaxed mb-[40px]">
                                We have sent the verification code to your <br /> phone number ending in <span className="text-white font-bold">{phone.length > 2 ? phone.slice(-2) : '89'}</span>.
                            </p>

                            <div className="flex justify-center gap-2.5 w-full mb-12" dir="ltr">
                                {otp.map((digit, idx) => {
                                    const isActive = focusedIdx === idx || (digit && focusedIdx === null);
                                    return (
                                        <input
                                            key={idx}
                                            id={`otp-${idx}`}
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            maxLength={1}
                                            value={digit}
                                            onFocus={() => setFocusedIdx(idx)}
                                            onBlur={() => setFocusedIdx(null)}
                                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                                            className="w-[50px] h-[64px] text-center text-[24px] font-bold rounded-[14px] transition-all duration-300 focus:outline-none"
                                            style={isActive ? {
                                                border: '1.5px solid #3b82f6',
                                                boxShadow: '0 0 20px rgba(59, 130, 246, 0.7)',
                                                background: '#0a1b33',
                                                color: 'white',
                                            } : {
                                                border: '1.5px solid #1e3a5f',
                                                background: 'rgba(6, 18, 36, 0.8)',
                                                color: 'white',
                                            }}
                                        />
                                    );
                                })}
                            </div>

                            <div className="text-center">
                                <p className="text-[#a8c7fa] text-sm mb-3">Did not receive the code?</p>
                                <div className="flex items-center gap-4 justify-center">
                                    <button className="text-[#3b82f6] font-bold text-[15px] hover:text-[#60a5fa] transition-colors bg-transparent border-none p-0">Resend Code</button>
                                    <span className="bg-transparent text-white px-3 py-1 rounded-lg text-xs font-mono ml-[10px]">00:30</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full" style={{ marginBottom: '100px' }}>
                            <button
                                onClick={handleVerifyOTP}
                                disabled={otp.join('').length < 6 || isLoading}
                                className="w-full h-[56px] rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-2 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed border-none"
                                style={{
                                    background: 'linear-gradient(180deg, #4488ff 0%, #1d4ed8 100%)',
                                    boxShadow: '0 10px 25px rgba(29, 78, 216, 0.4)',
                                    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                                }}
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Verify <span className="text-xl">→</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )
            }

            {
                step === 3 && (
                    <div className="text-center space-y-6 flex flex-col items-center justify-center animate-fade-in h-full flex-1">
                        <div className="w-24 h-24 bg-[var(--color-healing-green)]/20 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-12 h-12 text-[var(--color-healing-green)]" />
                        </div>
                        <h2 className="text-2xl font-heading text-[#FFFFFF] tracking-widest font-bold">{t('auth_success')}</h2>
                        <p className="text-[#FFFFFF] opacity-80 text-sm">{t('auth_redirect')}</p>
                    </div>
                )
            }
        </motion.div >
    );
};

export default AuthShell;
