'use client';

import LegalLayout from "@/app/components/landing/LegalLayout";

export default function PrivacyPage() {
    return (
        <LegalLayout title="Privacy Policy">
            <p><strong>Last updated: December 2024</strong></p>
            <p>At Verdyct ("we", "us", or "our"), we are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at legal@verdyct.io.</p>

            <h2>1. What information do we collect?</h2>
            <p>We collect personal information that you voluntarily provide to us when you register on the Website, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Website or otherwise when you contact us.</p>
            <p>The personal information that we collect depends on the context of your interactions with us and the Website, the choices you make and the products and features you use.</p>

            <h2>2. How do we use your information?</h2>
            <p>We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
            <ul>
                <li>To facilitate account creation and logon process.</li>
                <li>To post testimonials.</li>
                <li>To request feedback.</li>
                <li>To enable user-to-user communications.</li>
                <li>To manage user accounts.</li>
            </ul>

            <h2>3. Will your information be shared with anyone?</h2>
            <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
        </LegalLayout>
    );
}
