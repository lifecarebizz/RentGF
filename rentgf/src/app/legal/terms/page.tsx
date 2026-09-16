import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | RentGF",
  description: "RentGF Terms of Service — Read before using our companionship platform.",
};

const LAST_UPDATED = "September 16, 2026";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using RentGF ("Platform", "Service"), you agree to be legally bound by these Terms of Service ("Terms"). If you do not agree, you must immediately stop using the Platform.

These Terms constitute a legally binding agreement between you and RentGF. We reserve the right to modify these Terms at any time with 7 days' advance notice. Continued use after notice constitutes acceptance.`,
  },
  {
    title: "2. Eligibility",
    content: `You must meet ALL of the following criteria to use RentGF:

• You are at least 18 years of age
• You are a resident of India or using the Platform from India
• You have the legal capacity to enter into a binding contract
• You are not prohibited from using the Platform under any applicable law

By using RentGF, you represent and warrant that you meet all eligibility requirements. We reserve the right to terminate accounts of users found to be under 18, with immediate effect and permanent ban.`,
  },
  {
    title: "3. Nature of Service — Strictly Non-Sexual",
    content: `RentGF is a marketplace for lawful, non-sexual social companionship services only. This Platform facilitates connections between adults for activities such as:

• Conversation and social interaction
• Dining, coffee meetings
• Attending events, movies, concerts
• Sightseeing and travel companionship
• Language practice and cultural exchange
• Platonic social activities

**Strictly Prohibited:** The following activities are absolutely forbidden and will result in immediate permanent ban and reporting to law enforcement:

• Any sexual services, solicitation, or escort services
• Prostitution or activities regulated under the Immoral Traffic (Prevention) Act, 1956
• Any activity that violates Indian Penal Code provisions
• Facilitating meetings with the intent for sexual activity
• Exchange of sexually explicit content

RentGF is NOT an escort service, dating app, or adult services platform.`,
  },
  {
    title: "4. User Accounts",
    content: `**Registration:** You must provide accurate, current, and complete information during registration. False information is grounds for immediate termination.

**Account Security:** You are responsible for maintaining the confidentiality of your password. You must notify us immediately at support@rentgf.com of any unauthorized account access.

**One Account Per Person:** You may not create multiple accounts. Duplicate accounts will be terminated.

**Account Termination:** We reserve the right to suspend or terminate accounts that violate these Terms, without prior notice in cases of serious violations.`,
  },
  {
    title: "5. Companion Obligations",
    content: `Companions (service providers) on RentGF agree to:

• Provide accurate information in their profiles
• Submit to identity and age verification as required
• Only offer lawful, non-sexual companionship services
• Maintain professional conduct at all times
• Honour confirmed bookings or cancel with adequate notice
• Not engage in price manipulation or fraud
• Not solicit off-platform payments to avoid fees

Companions are independent contractors, not employees of RentGF. RentGF is not responsible for the quality or conduct of individual companions.`,
  },
  {
    title: "6. Customer Obligations",
    content: `Customers booking companionship services agree to:

• Treat companions with dignity and respect
• Only request lawful, non-sexual activities
• Not harass, coerce, or threaten companions
• Honour the booking terms and show up as agreed
• Provide honest, fair reviews
• Not attempt to contact companions outside the platform to circumvent fees
• Pay all applicable charges honestly`,
  },
  {
    title: "7. Payments & Platform Fees",
    content: `**Processing:** All payments are processed through Razorpay, a PCI-DSS compliant payment processor. By making a payment, you agree to Razorpay's terms.

**Platform Commission:** RentGF charges a 20% platform fee on all bookings. Companions receive 80% of the booking amount.

**Currency:** All transactions are in Indian Rupees (INR).

**Taxes:** You are responsible for any applicable taxes (GST, TDS) on your earnings or expenses.

**Disputes:** Payment disputes must be raised within 7 days of the booking date via support@rentgf.com.`,
  },
  {
    title: "8. Cancellation & Refunds",
    content: `**Customer Cancellations:**
• Cancelled 24+ hours before booking: 90% refund
• Cancelled 2–24 hours before: 50% refund
• Cancelled less than 2 hours before or no-show: No refund

**Companion Cancellations:**
• If a companion cancels, the customer receives a full 100% refund
• Repeated cancellations by companions may result in account suspension

**Refund Processing:** Refunds are processed within 5–7 business days to the original payment method.

For disputes, contact support@rentgf.com within 48 hours of the booking.`,
  },
  {
    title: "9. Prohibited Conduct",
    content: `The following conduct is strictly prohibited on RentGF:

• Posting false, misleading, or fraudulent information
• Harassment, threats, abuse, or discriminatory behaviour
• Sharing another user's personal information without consent
• Attempting to hack, scrape, or damage the Platform
• Circumventing safety features or verification processes
• Using the Platform for any illegal purpose under Indian law
• Creating fake reviews or manipulating ratings
• Using automated bots or scripts to access the Platform`,
  },
  {
    title: "10. Intellectual Property",
    content: `All content on RentGF — including the logo, design, code, text, and graphics — is owned by RentGF and protected by Indian copyright law. You may not reproduce, distribute, or create derivative works without written permission.

By uploading content (photos, bio, reviews) to RentGF, you grant us a non-exclusive, royalty-free licence to display and use that content to operate the Platform.`,
  },
  {
    title: "11. Limitation of Liability",
    content: `RentGF is a technology marketplace platform. To the maximum extent permitted by Indian law:

• We are not liable for the conduct of any user, companion, or customer
• We are not responsible for any physical, emotional, or financial harm arising from user interactions
• Our total liability in any dispute shall not exceed the amount you paid for the specific booking in question
• We are not liable for indirect, incidental, special, or consequential damages

You use this Platform at your own risk.`,
  },
  {
    title: "12. Governing Law & Disputes",
    content: `These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of [Your City], India.

For minor disputes, we encourage resolution through our support team at support@rentgf.com before pursuing legal action. We will attempt to resolve disputes within 30 days.`,
  },
  {
    title: "13. Contact",
    content: `For questions about these Terms:

**Email:** legal@rentgf.com
**Support:** support@rentgf.com

We aim to respond to all legal enquiries within 30 days.`,
  },
];

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500">Last updated: {LAST_UPDATED}</p>
        <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
          <p className="text-sm text-amber-800 font-medium">
            Please read these Terms carefully before using RentGF. By using the Platform, you agree to all terms below. RentGF is strictly an 18+ non-sexual companionship platform.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.title} className="border-b border-gray-100 pb-8 last:border-0">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{section.title}</h2>
            <div className="text-sm text-gray-600 leading-relaxed">
              {section.content.split("\n\n").map((para, i) => (
                <p key={i} className="mb-3" dangerouslySetInnerHTML={{
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
        <p className="text-sm text-gray-500">Questions? Email us at <a href="mailto:legal@rentgf.com" className="text-indigo-600 font-medium">legal@rentgf.com</a></p>
      </div>
    </div>
  );
}
