import React, { useState } from 'react';
import { MapPin, ShoppingBag, CreditCard, ChevronRight, Calculator } from 'lucide-react';
import type { CartItem } from '../../models/types';
import { ReceiptUpload } from '../Payment/ReceiptUpload';

const mockCart: CartItem[] = [
    {
        supplement: { id: 's1', name: 'Vitamin D3 & K2', description: 'Immune support', type: 'Liquid', price: 45, weightGrams: 100 },
        quantity: 2
    },
    {
        supplement: { id: 's2', name: 'Omega 3 Fish Oil', description: 'Heart & Brain Health', type: 'Pill', price: 30, weightGrams: 200 },
        quantity: 1
    }
];

const mockCountries = [
    { code: 'LB', name: 'Lebanon', baseFee: 5, perKgFee: 2 },
    { code: 'FR', name: 'France', baseFee: 15, perKgFee: 10 },
    { code: 'AE', name: 'UAE', baseFee: 20, perKgFee: 12 },
    { code: 'SA', name: 'Saudi Arabia', baseFee: 25, perKgFee: 15 },
];

export const Checkout: React.FC = () => {
    const [selectedCountry, setSelectedCountry] = useState(mockCountries[0]);
    const [step, setStep] = useState<'cart' | 'shipping' | 'payment'>('cart');

    const subtotal = mockCart.reduce((sum, item) => sum + (item.supplement.price * item.quantity), 0);
    const totalWeightGram = mockCart.reduce((sum, item) => sum + (item.supplement.weightGrams * item.quantity), 0);
    const totalWeightKg = totalWeightGram / 1000;

    // Dynamic Shipping Logic
    const calculatedShippingFee = selectedCountry.baseFee + (totalWeightKg * selectedCountry.perKgFee);
    const finalTotal = subtotal + calculatedShippingFee;

    return (
        <div className="w-full space-y-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-heading font-semibold text-[var(--text-primary)]">
                    {step === 'cart' ? 'Your Cart' : step === 'shipping' ? 'Shipping Details' : 'Payment'}
                </h2>
                <span className="text-sm font-medium px-3 py-1 bg-[var(--color-gold)]/10 text-[var(--color-gold)] rounded-full">
                    Step {step === 'cart' ? '1' : step === 'shipping' ? '2' : '3'} of 3
                </span>
            </div>

            {step === 'cart' && (
                <div className="space-y-4 animate-fade-in">
                    {mockCart.map(item => (
                        <div key={item.supplement.id} className="glass-panel p-4 flex gap-4 items-center">
                            <div className="w-16 h-16 rounded-xl bg-[var(--bg-secondary)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--color-healing-green)]">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-sm">{item.supplement.name}</h4>
                                <p className="text-xs text-[var(--text-secondary)]">{item.supplement.type} • {item.supplement.weightGrams}g</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">${item.supplement.price * item.quantity}</p>
                                <p className="text-xs text-[var(--text-secondary)]">Qty: {item.quantity}</p>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={() => setStep('shipping')}
                        className="w-full py-4 mt-6 rounded-xl font-semibold bg-[var(--color-healing-green)] text-white shadow-md hover:bg-[var(--color-healing-green-light)] haptic-ripple flex justify-center items-center gap-2 transition-all"
                    >
                        Review Shipping & Taxes <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}

            {step === 'shipping' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="glass-panel p-6 shadow-sm border-[var(--color-gold)] border-t-2">
                        <h3 className="text-lg font-heading mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-[var(--color-healing-green)]" /> Delivery Location
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] mb-4">Please confirm your country to calculate shipping fees. Fees are based on distance and order weight ({totalWeightKg.toFixed(2)}kg).</p>

                        <select
                            value={selectedCountry.code}
                            onChange={(e) => setSelectedCountry(mockCountries.find(c => c.code === e.target.value) || mockCountries[0])}
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl p-3 appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--color-healing-green)] transition-all mb-4"
                        >
                            {mockCountries.map(c => (
                                <option key={c.code} value={c.code}>{c.name}</option>
                            ))}
                        </select>

                        <div className="bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                                <Calculator className="w-4 h-4" /> Estimated Shipping
                            </div>
                            <span className="font-semibold text-[var(--color-primary)]">${calculatedShippingFee.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="glass-panel p-6 shadow-sm">
                        <h3 className="font-heading font-semibold mb-3 border-b border-[var(--glass-border)] pb-2">Order Summary</h3>
                        <div className="space-y-2 text-sm pt-2">
                            <div className="flex justify-between text-[var(--text-secondary)]">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-[var(--text-secondary)]">
                                <span>Shipping ({totalWeightKg}kg to {selectedCountry.name})</span>
                                <span>${calculatedShippingFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t border-[var(--glass-border)] mt-2">
                                <span>Total</span>
                                <span>${finalTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={() => setStep('cart')} className="py-4 px-6 rounded-xl font-semibold bg-[var(--bg-secondary)] border border-[var(--glass-border)] text-[var(--text-secondary)] hover:bg-black/5 flex items-center transition-all haptic-ripple">
                            Back
                        </button>
                        <button
                            onClick={() => setStep('payment')}
                            className="flex-1 py-4 flex justify-center items-center gap-2 rounded-xl font-semibold bg-[var(--color-healing-green)] text-white shadow-md hover:bg-[var(--color-healing-green-light)] haptic-ripple transition-all"
                        >
                            Proceed to Payment <CreditCard className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {step === 'payment' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="glass-panel p-4 flex justify-between items-center text-lg font-heading border-[var(--color-healing-green)] border-l-4">
                        <span>Total to clear:</span>
                        <span className="font-bold">${finalTotal.toFixed(2)}</span>
                    </div>

                    <ReceiptUpload
                        allowedMethods={['Whish', 'OMT', 'WesternUnion']}
                        onUploadSuccess={(url) => console.log('Payment receipt attached:', url)}
                    />

                    <button onClick={() => setStep('shipping')} className="text-sm text-[var(--color-healing-green)] hover:underline block text-center mx-auto mt-4">
                        Change Shipping Address
                    </button>
                </div>
            )}
        </div>
    );
};
