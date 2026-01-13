'use client';

import LegalLayout from "@/app/[locale]/components/landing/LegalLayout";
import { useTranslations } from "next-intl";

export default function PrivacyPage() {
    const t = useTranslations('Legal.privacy');
    const usageList = t.raw('sections.usage.list') as string[];

    return (
        <LegalLayout title={t('title')}>
            <p><strong>{t('lastUpdated')}</strong></p>
            <p>{t('intro')}</p>

            <h2>{t('sections.infoCollect.title')}</h2>
            <p>{t('sections.infoCollect.text1')}</p>
            <p>{t('sections.infoCollect.text2')}</p>

            <h2>{t('sections.usage.title')}</h2>
            <p>{t('sections.usage.text')}</p>
            <ul>
                {usageList.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>

            <h2>{t('sections.sharing.title')}</h2>
            <p>{t('sections.sharing.text')}</p>
        </LegalLayout>
    );
}
