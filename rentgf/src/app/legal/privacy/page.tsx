import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | RentGF",
  description: "How RentGF collects, uses, and protects your personal information.",
};

const LAST_UPDATED = "September 16, 2026";

const sections = [
  {
    title: "1. Introduction",
    content: `RentGF ("we", "our", or "us") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. By using RentGF, you consent to the practices described in this policy.

This policy complies with the Information Technology Act, 2000 and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 (India).`,
  },
  {
    title: "2. Information We Collect",
    content: `We collect the following categories of information:

**Account Information:** Name, email address, phone number, date of birth, city, and password (stored as encrypted hash).

**Profile Information:** Display name, bio, interests, categories, languages, profile photo, and availability.

**Verification Documents:** Government-issued ID documents submitted during companion verification (stored securely, never publicly displayed).

**Booking & Payment Information:** Booking history, transaction IDs, payment status. We do not store full card numbers — payments are processed by Razorpay under their own privacy policy.

**Usage Data:** IP address, browser type, pages visited, session duration, and device information for analytics and security purposes.

**Communications:** Messages sent through our in-platform messaging system.`,
  },
  {
    title: "3. How We Use Your Information",
    content: `We use your information to:

• Operate and improve the RentGF platform
• Verify your identity and age (18+ enforcement)
• Process bookings and payments
• Send transactional emails (booking confirmations, OTPs, alerts)
• Provide customer support
• Detect and prevent fraud, abuse, and illegal activity
• Comply with applicable Indian laws and respond to legal requests
• Send platform-related notifications (you can opt out of non-essential emails)

We do NOT use your data for:
• Selling to third parties
• Targeted advertising outside our platform
• Profiling for purposes unrelated to platform safety`,
  },
  {
    title: "4. Sharing of Information",
    content: `We share your information only in the following limited circumstances:

**Between Users:** Your public profile (display name, bio, interests, city, photos) is visible to other platform users. Your contact details are never shared directly.

**Service Providers:** We share necessary data with Razorpay (payments), Resend (email delivery), and Cloudflare (CDN and security). These providers are contractually bound to protect your data.

**Legal Requirements:** We will disclose information if required by law, court order, or government authority under Indian law.

**Safety:** We may share information to prevent imminent harm to any person.

We do NOT sell, rent, or trade your personal data to any third party for commercial purposes.`,
  },
  {
    title: "5. Data Storage & Security",
    content: `Your data is stored on secure servers. We implement industry-standard security measures including:

• Passwords encrypted using bcrypt with salt rounds
• JWT tokens with expiry for session management
• HTTPS encryption for all data in transit
• Verification documents stored in private cloud storage (not publicly accessible)
• Regular security audits

While we take every reasonable measure, no method of transmission over the internet is 100% secure. You use the platform at your own risk and should use a strong, unique password.`,
  },
  {
    title: "6. Data Retention",
    content: `We retain your data as long as your account is active or as needed to provide services. Specifically:

• Account data: Retained for the life of your account + 2 years for legal compliance
• Booking records: Retained for 5 years (financial regulation compliance)
• Verification documents: Deleted within 90 days of account closure
• Chat messages: Retained for 1 year

You can request deletion of your account and associated data by contacting us. Some data may be retained if required by law.`,
  },
  {
    title: "7. Your Rights",
    content: `Under Indian law and our policy, you have the right to:

• **Access:** Request a copy of the personal data we hold about you
• **Correction:** Request correction of inaccurate data
• **Deletion:** Request deletion of your account and personal data
• **Portability:** Request your data in a machine-readable format
• **Opt-out:** Unsubscribe from non-essential marketing emails at any time

To exercise any of these rights, contact us at privacy@rentgf.com with the subject line "Privacy Request". We will respond within 30 days.`,
  },
  {
    title: "8. Cookies",
    content: `We use the following cookies:

• **Authentication cookie (token):** Required for login sessions. Expires in 30 days.
• **Preference cookies:** Store UI preferences such as language. Session-based.

We do not use third-party advertising cookies. You can disable cookies in your browser settings, but this may affect platform functionality.`,
  },
  {
    title: "9. Children's Privacy",
    content: `RentGF is strictly an 18+ platform. We do not knowingly collect information from anyone under 18 years of age. If we discover that a minor has registered, we will immediately delete their account and all associated data. If you believe a minor is using our platform, please contact us immediately at safety@rentgf.com.`,
  },
  {
    title: "10. Third-Party Links",
    content: `Our platform may contain links to third-party websites. We are not responsible for the privacy practices of those sites. We encourage you to review the privacy policies of any third-party sites you visit.`,
  },
  {
    title: "11. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a prominent notice on the platform at least 7 days before they take effect. Continued use of the platform after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: "12. Grievance Officer",
    content: `As required under the Information Technology Act, 2000, we have appointed a Grievance Officer:

**Name:** RentGF Privacy Team
**Email:** privacy@rentgf.com
**Response time:** Within 30 days of receiving a complaint

For any privacy concerns, data requests, or grievances, please contact us at the above email.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500">Last updated: {LAST_UPDATED}</p>
        <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
          <p className="text-sm text-indigo-800">
            This policy explains how RentGF collects, uses, and protects your personal information in compliance with Indian law (IT Act, 2000 and SPDI Rules, 2011).
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.title} className="border-b border-gray-100 pb-8 last:border-0">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{section.title}</h2>
            <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line space-y-2">
              {section.content.split("\n\n").map((para, i) => (
                <p key={i} dangerouslySetInnerHTML={{
                  __html: para
                    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\n•/g, "<br />•")
                    .replace(/\n/g, "<br />")
                }} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-xl text-center">
        <p className="text-sm text-gray-500">Questions? Email us at <a href="mailto:privacy@rentgf.com" className="text-indigo-600 font-medium">privacy@rentgf.com</a></p>
      </div>
    </div>
  );
}
