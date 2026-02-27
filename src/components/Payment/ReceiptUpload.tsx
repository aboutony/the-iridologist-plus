import React, { useState } from 'react';
import { Upload, FileType, CheckCircle } from 'lucide-react';

interface ReceiptUploadProps {
    onUploadSuccess: (fileUrl: string) => void;
    allowedMethods: ('Whish' | 'OMT' | 'WesternUnion')[];
}

export const ReceiptUpload: React.FC<ReceiptUploadProps> = ({ onUploadSuccess, allowedMethods }) => {
    const [selectedMethod, setSelectedMethod] = useState<string>(allowedMethods[0]);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (!file) return;
        setIsUploading(true);

        // Simulate upload delay
        setTimeout(() => {
            setIsUploading(false);
            setIsDone(true);
            onUploadSuccess(`mock-url-${file.name}`);
        }, 2000);
    };

    return (
        <div className="glass-panel p-6 shadow-sm">
            <h3 className="text-lg font-heading mb-4 border-b border-[var(--glass-border)] pb-2 flex items-center gap-2">
                <FileType className="w-5 h-5 text-[var(--color-gold)]" /> Upload Payment Receipt
            </h3>

            {!isDone ? (
                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[var(--text-secondary)]">Payment Method</label>
                        <div className="grid grid-cols-3 gap-2">
                            {allowedMethods.map(method => (
                                <button
                                    key={method}
                                    onClick={() => setSelectedMethod(method)}
                                    className={`py-2 rounded-lg text-sm transition-all border ${selectedMethod === method
                                            ? 'bg-[var(--color-healing-green)]/10 border-[var(--color-healing-green)] text-[var(--color-healing-green)] font-semibold shadow-sm'
                                            : 'bg-transparent border-[var(--glass-border)] text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5'
                                        }`}
                                >
                                    {method}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[var(--text-secondary)]">Attach Receipt</label>
                        <div className="border-2 border-dashed border-[var(--glass-border)] rounded-xl p-8 flex flex-col items-center justify-center text-center relative hover:bg-black/5 transition-colors cursor-pointer group">
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                            />
                            <Upload className="w-8 h-8 text-[var(--text-secondary)] mb-3 group-hover:text-[var(--color-healing-green)] transition-colors" />
                            <p className="font-semibold text-[var(--text-primary)]">
                                {file ? file.name : 'Click or drag receipt here'}
                            </p>
                            <p className="text-xs text-[var(--text-secondary)] mt-1">JPEG, PNG, or PDF up to 5MB</p>
                        </div>
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={!file || isUploading}
                        className="w-full py-4 mt-2 rounded-xl font-semibold bg-[var(--color-healing-green)] text-white shadow-md hover:bg-[var(--color-healing-green-light)] disabled:opacity-50 disabled:cursor-not-allowed haptic-ripple flex justify-center items-center gap-2 transition-all"
                    >
                        {isUploading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Submit Receipt for Review'}
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center py-6 text-center animate-fade-in">
                    <div className="w-16 h-16 rounded-full bg-[var(--color-gold)]/10 flex items-center justify-center mb-4 text-[var(--color-gold)]">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <h4 className="font-semibold text-lg mb-1">Receipt Submitted</h4>
                    <p className="text-sm text-[var(--text-secondary)]">Your receipt is currently under review by Dr. Philippe's team. You will be notified once approved.</p>
                </div>
            )}
        </div>
    );
};
