'use client';

import LegalLayout from "@/app/[locale]/components/landing/LegalLayout";
import { useTranslations } from "next-intl";

export default function SecurityPage() {
    const t = useTranslations('Legal.security');
    const infraList = t.raw('infra.list') as string[];

    return (
        <LegalLayout title={t('title')}>
            <p>{t('intro')}</p>

            <h2>{t('infra.title')}</h2>
            <p>{t('infra.text')}</p>
            <ul>
                {infraList.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>

            <h2>{t('encryption.title')}</h2>
            <p>{t('encryption.text')}</p>
            <ul>
                <li><strong>{t('encryption.transit')}</strong></li>
                <li><strong>{t('encryption.rest')}</strong></li>
            </ul>

            <h2>{t('access.title')}</h2>
            <p>{t('access.text')}</p>

            <h2>{t('reporting.title')}</h2>
            <p>{t('reporting.text')}</p>
        </LegalLayout>
    );
}
