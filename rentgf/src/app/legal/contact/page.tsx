import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Support | RentGF",
  description: "Get help from RentGF support team.",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Contact & Support</h1>
      <div className="prose prose-indigo max-w-none space-y-6 text-gray-700">
        <p>We&apos;re here to help. Reach out through any of the following channels:</p>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">Email Support</h2>
          <p>support@rentgf.com (Response within 24 hours)</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">In-App Support</h2>
          <p>Use the help center in your dashboard for quick assistance.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">Safety Emergencies</h2>
          <p>For immediate safety concerns, use the emergency report feature in the app.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">Legal/Press Inquiries</h2>
          <p>legal@rentgf.com</p>
        </section>
      </div>
    </div>
  );
}
