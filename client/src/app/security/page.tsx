'use client';

import LegalLayout from "@/app/components/landing/LegalLayout";

export default function SecurityPage() {
    return (
        <LegalLayout title="Security Practices">
            <p>Security is not an afterthought at Verdyct. It is integral to our architecture.</p>

            <h2>Infrastructure Security</h2>
            <p>Our application is hosted on world-class cloud providers that maintain ISO 27001, SOC 2 Type II, and PCI-DSS certifications. We utilize a multi-layered security approach, including:</p>
            <ul>
                <li>Virtual Private Cloud (VPC) isolation</li>
                <li>Web Application Firewalls (WAF)</li>
                <li>DDoS protection</li>
                <li>Regular automated vulnerability scanning</li>
            </ul>

            <h2>Data Encryption</h2>
            <p>We use strong encryption to protect your data both in transit and at rest.</p>
            <ul>
                <li><strong>In Transit:</strong> All data transmitted between your browser and our servers is encrypted using valid TLS 1.2 or higher.</li>
                <li><strong>At Rest:</strong> Sensitive data stored in our databases is encrypted using AES-256 standards.</li>
            </ul>

            <h2>Access Control</h2>
            <p>Access to production systems is strictly limited to authorized personnel on a need-to-know basis. We enforce Multi-Factor Authentication (MFA) for all internal access.</p>

            <h2>Reporting Vulnerabilities</h2>
            <p>We welcome reports from the security research community. If you discover a vulnerability, please disclose it to us responsibly by emailing security@verdyct.io.</p>
        </LegalLayout>
    );
}
