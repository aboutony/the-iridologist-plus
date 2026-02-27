import React, { useState } from 'react';
import { Camera, ShieldCheck, FileKey, Info } from 'lucide-react';

export const IrisTestTrigger: React.FC = () => {
    const [hasPaid, setHasPaid] = useState(false);
    const [isPhotoUploaded, setIsPhotoUploaded] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const iristTestFee = 150; // Standalone fee

    const handlePurchaseMock = () => {
        // Simulated payment logic wrapper
        setTimeout(() => {
            setHasPaid(true);
        }, 1500);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleUploadMock = () => {
        if (!file) return;
        setTimeout(() => {
            setIsPhotoUploaded(true);
        }, 1500);
    };

    return (
        <div className="glass-panel flex flex-col overflow-hidden relative border-[var(--color-gold)] border-t-4">
            <div className="p-6 pb-4 border-b border-[var(--glass-border)]">
                <h2 className="text-xl font-heading mb-2 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-[var(--color-gold)]" /> Comprehensive Iris Analysis
                </h2>
                <p className="text-[var(--text-secondary)] text-sm mb-4">
                    A standalone clinical diagnostic tool. Upload a high-resolution macro shot of your eyes for Dr. Philippe’s direct assessment.
                </p>
                <div className="bg-[var(--color-healing-green)]/10 text-[var(--color-healing-green)] px-3 py-2 rounded-lg text-xs font-medium flex items-start gap-2">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Note: This is a discrete one-time purchase outside of regular subscription plans.</span>
                </div>
            </div>

            <div className="p-6">
                {!hasPaid ? (
                    <div className="space-y-4 animate-fade-in text-center flex flex-col items-center">
                        <div className="text-3xl font-bold font-heading mb-2">${iristTestFee}</div>
                        <p className="text-sm text-[var(--text-secondary)] mb-2">Lifetime access to your generated Iris Profile.</p>

                        <button
                            onClick={handlePurchaseMock}
                            className="w-full py-4 mt-2 rounded-xl font-semibold bg-[var(--color-gold)] text-[var(--color-deep-slate)] shadow-md hover:bg-[var(--color-gold-light)] haptic-ripple flex justify-center items-center gap-2 transition-all"
                        >
                            Unlock Analysis Feature
                        </button>
                    </div>
                ) : !isPhotoUploaded ? (
                    <div className="space-y-5 animate-fade-in">
                        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-healing-green)] mb-2">
                            <ShieldCheck className="w-4 h-4" /> Payment Confirmed. Camera Unlocked.
                        </div>

                        <div className="border-2 border-dashed border-[var(--color-healing-green)] rounded-xl p-8 flex flex-col items-center justify-center text-center relative hover:bg-black/5 transition-colors cursor-pointer group bg-[var(--color-healing-green)]/5">
                            <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                            />
                            <Camera className="w-10 h-10 text-[var(--color-healing-green)] mb-3 group-hover:scale-110 transition-transform duration-300" />
                            <p className="font-semibold text-[var(--color-healing-green)]">
                                {file ? file.name : "Tap to open camera"}
                            </p>
                            <p className="text-xs text-[var(--text-secondary)] mt-1">Use macro setting with flash on for best results.</p>
                        </div>

                        <button
                            onClick={handleUploadMock}
                            disabled={!file}
                            className="w-full py-4 rounded-xl font-semibold bg-[var(--color-healing-green)] text-white shadow-md hover:bg-[var(--color-healing-green-light)] disabled:opacity-50 disabled:cursor-not-allowed haptic-ripple transition-all"
                        >
                            Submit for Clinical Review
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-center animate-fade-in py-4">
                        <div className="w-16 h-16 rounded-full bg-[var(--color-gold)]/10 flex items-center justify-center mb-4 text-[var(--color-gold)]">
                            <FileKey className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-heading font-semibold mb-1">Analysis in Progress</h3>
                        <p className="text-sm text-[var(--text-secondary)]">Dr. Philippe's team has received your macro shots. You will be notified when your diagnostic report is ready.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
