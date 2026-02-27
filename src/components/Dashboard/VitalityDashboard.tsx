import React from 'react';
import { HealingProgressRing } from './HealingProgressRing';
import { IntegratedTimetable } from './IntegratedTimetable';
import { DailyEcho } from './DailyEcho';
import type { Language } from '../../models/types';

const dailyEchoData = {
    title: {
        en: 'Hydration \u0026 Detox Synergy',
        fr: 'Synergie Hydratation \u0026 Détox',
        ar: 'تآزر الترطيب والتخلص من السموم',
    } as Record<Language, string>,
    message: {
        en: 'Your liver enzymes respond better when paired with adequate hydration. Aim for 2L today.',
        fr: 'Vos enzymes hépatiques répondent mieux avec une hydratation adéquate. Visez 2L aujourd\'hui.',
        ar: 'تستجيب إنزيمات الكبد بشكل أفضل مع الترطيب الكافي. اهدف إلى لترين اليوم.',
    } as Record<Language, string>,
};

export const VitalityDashboard: React.FC = () => {

    return (
        <div className="zone-main zone-main--dashboard">
            {/* Healing Progress Ring */}
            <HealingProgressRing percentage={72} />

            {/* Daily Echo Card */}
            <DailyEcho title={dailyEchoData.title} message={dailyEchoData.message} />

            {/* Integrated Timetable */}
            <IntegratedTimetable />
        </div>
    );
};

export default VitalityDashboard;
