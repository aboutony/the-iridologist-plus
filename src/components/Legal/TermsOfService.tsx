import React from 'react';
import { ScrollText, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Language } from '../../models/types';

export const TermsOfService: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { i18n } = useTranslation();
    const currentLang = i18n.language as Language;

    const content = {
        en: {
            title: "Terms of Service",
            intro: "Welcome to The Iridologist platform operated by Dr. Philippe Hadashy. By using this application, you agree to these legal bindings.",
            sections: [
                { h: "1. Medical Disclaimer", p: "The Iridologist provides nutritional and lifestyle insights based on empirical iridology study. It does not replace immediate, professional medical treatment or acute diagnoses from a certified hospital." },
                { h: "2. Subscriptions & Payments", p: "Payments processed via Whish, OMT, or Western Union are manually verified. Subscriptions to Bronze, Silver, or Gold tiers are billed annually unless otherwise explicitly canceled in your provider dashboard." },
                { h: "3. Product Logistics", p: "We rely on courier accuracy. International shipping fees via the Shipping Engine vary dynamically by selected country and total weight of items in Cart." }
            ]
        },
        fr: {
            title: "Conditions de Service",
            intro: "Bienvenue sur la plateforme L'Iridologue gérée par le Dr Philippe Hadashy. En utilisant cette application, vous acceptez ces obligations légales.",
            sections: [
                { h: "1. Avis de Non-responsabilité Médicale", p: "L'Iridologue fournit des informations nutritionnelles et de style de vie basées sur des études empiriques d'iridologie. Il ne remplace pas un traitement médical professionnel immédiat ou des diagnostics aigus provenant d'un hôpital certifié." },
                { h: "2. Abonnements et Paiements", p: "Les paiements traités via Whish, OMT ou Western Union sont vérifiés manuellement. Les abonnements aux niveaux Bronze, Silver ou Gold sont facturés annuellement sauf annulation explicite dans le tableau de bord de votre fournisseur." },
                { h: "3. Logistique des Produits", p: "Nous comptons sur l'exactitude du transporteur. Les frais d'expédition internationaux via le moteur d'expédition varient dynamiquement en fonction du pays sélectionné et du poids total des articles dans le panier." }
            ]
        },
        ar: {
            title: "شروط الخدمة",
            intro: "مرحبًا بكم في منصة The Iridologist التي يديرها الدكتور فيليب هداشي. باستخدام هذا التطبيق، فإنك توافق على هذه الالتزامات القانونية.",
            sections: [
                { h: "1. إخلاء المسؤولية الطبية", p: "يوفر The Iridologist رؤى التغذية وأسلوب الحياة بناءً على دراسة القزحية التجريبية. لا يحل محل العلاج الطبي الفوري والمهني أو التشخيصات الحادة من مستشفى معتمد." },
                { h: "2. الاشتراكات والمدفوعات", p: "يتم التحقق يدويًا من المدفوعات التي تتم معالجتها عبر Whish أو OMT أو Western Union. تتم فوترة الاشتراكات في فئات البرونز أو الفضية أو الذهبية سنويًا ما لم يتم إلغاؤها صراحة في لوحة معلومات الموفر الخاصة بك." },
                { h: "3. لوجستيات المنتجات", p: "نحن نعتمد على دقة البريد السريع. تختلف رسوم الشحن الدولي عبر محرك الشحن ديناميكيًا حسب الدولة المحددة والوزن الإجمالي للعناصر في سلة التسوق." }
            ]
        }
    };

    const text = content[currentLang] || content.en;

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in p-4 lg:p-0">
            <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-[var(--color-healing-green)] hover:underline mb-4 haptic-ripple">
                <ArrowLeft className="w-4 h-4" /> Back to Application
            </button>

            <div className="glass-panel p-6 shadow-sm border-[var(--color-gold)] border-t-4">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--glass-border)]">
                    <div className="w-12 h-12 rounded-full bg-[var(--color-gold)]/10 flex items-center justify-center text-[var(--color-gold)]">
                        <ScrollText className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-heading font-bold text-[var(--text-primary)]">{text.title}</h2>
                </div>

                <p className="text-[var(--text-secondary)] mb-6 text-sm leading-relaxed">{text.intro}</p>

                <div className="space-y-6">
                    {text.sections.map((section, idx) => (
                        <div key={idx} className="bg-[var(--bg-secondary)] p-4 rounded-xl border border-[var(--glass-border)] shadow-sm">
                            <h3 className="font-semibold text-[var(--text-primary)] mb-2 font-heading">{section.h}</h3>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{section.p}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
