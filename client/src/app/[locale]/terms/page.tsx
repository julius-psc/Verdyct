'use client';

import LegalLayout from "@/app/[locale]/components/landing/LegalLayout";
import { useTranslations } from "next-intl";

export default function TermsPage() {
    const t = useTranslations('Legal.terms');

    return (
        <LegalLayout title={t('title')}>
            <p><strong>{t('lastUpdated')}</strong></p>
            <p>{t('intro')}</p>

            <h2>{t('sections.acceptance.title')}</h2>
            <p>{t('sections.acceptance.text')}</p>

            <h2>{t('sections.ip.title')}</h2>
            <p>{t('sections.ip.text1')}</p>
            <p>{t('sections.ip.text2')}</p>

            <h2>{t('sections.accounts.title')}</h2>
            <p>{t('sections.accounts.text')}</p>

            <h2>{t('sections.termination.title')}</h2>
            <p>{t('sections.termination.text')}</p>

            <h2>{t('sections.liability.title')}</h2>
            <p>{t('sections.liability.text')}</p>
        </LegalLayout>
    );
}
