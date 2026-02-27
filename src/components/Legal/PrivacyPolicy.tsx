import React from 'react';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Language } from '../../models/types';

export const PrivacyPolicy: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { i18n } = useTranslation();
    const currentLang = i18n.language as Language;

    const content = {
        en: {
            title: "Privacy Policy",
            intro: "At The Iridologist, safeguarding your clinical and personal data is our highest priority. This Privacy Policy documents how we collect and secure your information.",
            sections: [
                { h: "1. Data Collection", p: "We collect onboarding country codes, OTP verification numbers, and strictly voluntary medical symptom tags." },
                { h: "2. Visual Media Uploads", p: "High-resolution iris photographs submitted for the Iris Analysis Tool are processed securely and discarded or anonymized upon report generation." },
                { h: "3. Compliance", p: "Our infrastructure aligns with regional data privacy laws including GDPR in France and local data directives across the UAE and Saudi Arabia." }
            ],
            footer: "Last Updated: February 2026"
        },
        fr: {
            title: "Politique de Confidentialité",
            intro: "Chez L'Iridologue, la protection de vos données cliniques et personnelles est notre priorité absolue. Cette politique de confidentialité documente la manière dont nous collectons et sécurisons vos informations.",
            sections: [
                { h: "1. Collecte de Données", p: "Nous collectons les codes de pays d'intégration, les numéros de vérification OTP et les balises de symptômes médicaux strictement volontaires." },
                { h: "2. Téléchargements de Médias Visuels", p: "Les photographies d'iris haute résolution soumises pour l'outil d'analyse d'iris sont traitées de manière sécurisée et jetées ou rendues anonymes lors de la génération du rapport." },
                { h: "3. Conformité", p: "Notre infrastructure s'aligne sur les lois régionales sur la confidentialité des données, y compris le RGPD en France et les directives locales sur les données aux Émirats arabes unis et en Arabie saoudite." }
            ],
            footer: "Dernière Mise à Jour: Février 2026"
        },
        ar: {
            title: "سياسة الخصوصية",
            intro: "في The Iridologist، حماية بياناتك السريرية والشخصية هي أولويتنا القصوى. توثق سياسة الخصوصية هذه كيفية جمع وتأمين معلوماتك.",
            sections: [
                { h: "1. جمع البيانات", p: "نقوم بجمع رموز بلدان الانضمام، وأرقام التحقق لمرة واحدة (OTP)، وعلامات الأعراض الطبية التطوعية بدقة." },
                { h: "2. تحميلات الوسائط المرئية", p: "تتم معالجة صور القزحية عالية الدقة المقدمة لأداة تحليل القزحية بشكل آمن ويتم تجاهلها أو جعلها مجهولة عند إنشاء التقرير." },
                { h: "3. الامتثال", p: "تتوافق بنيتنا التحتية مع قوانين خصوصية البيانات الإقليمية بما في ذلك اللائحة العامة لحماية البيانات (GDPR) في فرنسا والتوجيهات المحلية للبيانات في الإمارات العربية المتحدة والمملكة العربية السعودية." }
            ],
            footer: "آخر تحديث: فبراير 2026"
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
                    <div className="w-12 h-12 rounded-full bg-[var(--color-healing-green)]/10 flex items-center justify-center text-[var(--color-healing-green)]">
                        <ShieldCheck className="w-6 h-6" />
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

                <div className="mt-8 pt-4 border-t border-[var(--glass-border)] text-center text-xs text-[var(--text-secondary)] opacity-60">
                    {text.footer}
                </div>
            </div>
        </div>
    );
};
