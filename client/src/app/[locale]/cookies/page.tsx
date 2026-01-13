'use client';

import LegalLayout from "@/app/[locale]/components/landing/LegalLayout";
import { useTranslations } from "next-intl";

export default function CookiesPage() {
    const t = useTranslations('Legal.cookies');

    return (
        <LegalLayout title={t('title')}>
            <p>{t('intro')}</p>

            <h2>{t('what.title')}</h2>
            <p>{t('what.text')}</p>

            <h2>{t('why.title')}</h2>
            <p>{t('why.text')}</p>

            <h2>{t('types.title')}</h2>
            <h3>{t('types.essential.title')}</h3>
            <p>{t('types.essential.text')}</p>

            <h3>{t('types.perf.title')}</h3>
            <p>{t('types.perf.text')}</p>

            <h3>{t('types.analytics.title')}</h3>
            <p>{t('types.analytics.text')}</p>

            <h2>{t('control.title')}</h2>
            <p>{t('control.text')}</p>
        </LegalLayout>
    );
}
