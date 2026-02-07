'use client';

import PageWrapper from "@/app/[locale]/components/landing/PageWrapper";
import { motion } from "motion/react";
import { Link } from "@/i18n/routing";
import { IconArrowLeft } from "@tabler/icons-react";

export default function MentionsLegalesPage() {
    return (
        <PageWrapper>
            <div className="max-w-4xl mx-auto px-6 mb-32">
                <Link
                    href="/legal"
                    className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-10 transition-colors"
                >
                    <IconArrowLeft className="w-5 h-5" />
                    Back to Legal Hub
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="prose prose-invert max-w-none"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Mentions Légales</h1>
                    <p className="text-xl text-neutral-400 mb-12">
                        Conformément aux dispositions des Articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004 pour la Confiance dans l’économie numérique, dite L.C.E.N., il est porté à la connaissance des utilisateurs et visiteurs du site Verdyct les présentes mentions légales.
                    </p>

                    <div className="space-y-12">
                        {/* 1. Editeur */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Éditeur du site</h2>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-neutral-300 space-y-2">
                                <p><strong className="text-white">Dénomination :</strong> Issa Prunier</p>
                                <p><strong className="text-white">Forme juridique :</strong> Entrepreneur individuel</p>
                                <p><strong className="text-white">Siège social :</strong> 2 BD Maréchal Juin, 14000 Caen, FRANCE</p>
                                <p><strong className="text-white">SIREN :</strong> 934 636 366</p>
                                <p><strong className="text-white">Code APE :</strong> 62.01Z</p>
                                <p><strong className="text-white">Date d’immatriculation :</strong> 03/02/2026</p>
                                <p><strong className="text-white">Département :</strong> 14 - Calvados</p>
                                <p><strong className="text-white">Email de contact :</strong> contact@verdyct.io</p>
                            </div>
                        </section>

                        {/* 2. Directeur de publication */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. Directeur de la publication</h2>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-neutral-300">
                                <p>Le Directeur de la publication est <strong className="text-white">Issa Prunier</strong>.</p>
                                <p>Co-Directeur : <strong className="text-white">Julius</strong>.</p>
                            </div>
                        </section>

                        {/* 3. Hébergement */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. Hébergement</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-neutral-300">
                                    <h3 className="text-lg font-semibold text-white mb-3">Frontend</h3>
                                    <p><strong className="text-white">Vercel Inc.</strong></p>
                                    <p className="text-sm mt-1">440 N Barranca Ave #4133</p>
                                    <p className="text-sm">Covina, CA 91723</p>
                                    <p className="text-sm">United States</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-neutral-300">
                                    <h3 className="text-lg font-semibold text-white mb-3">Backend</h3>
                                    <p><strong className="text-white">Railway Corp.</strong></p>
                                    <p className="text-sm mt-1">San Francisco, CA</p>
                                    <p className="text-sm">United States</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-neutral-300 md:col-span-2">
                                    <h3 className="text-lg font-semibold text-white mb-3">Base de données</h3>
                                    <p><strong className="text-white">Supabase Inc.</strong></p>
                                    <p className="text-sm mt-1">970 Toa Payoh North #07-04</p>
                                    <p className="text-sm">Singapore 318992</p>
                                </div>
                            </div>
                        </section>

                        {/* 4. Propriété intellectuelle */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Propriété intellectuelle</h2>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-neutral-300">
                                <p>
                                    L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
                                </p>
                            </div>
                        </section>
                    </div>
                </motion.div>
            </div>
        </PageWrapper>
    );
}
