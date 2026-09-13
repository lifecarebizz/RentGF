import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | RentGF",
  description: "How RentGF collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose prose-indigo max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900">1. Information Collection</h2>
          <p>We collect information you provide during registration, including name, email, phone, and profile data.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">2. Data Usage</h2>
          <p>Your data is used to operate the platform, provide services, ensure safety, and improve user experience.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">3. Data Protection</h2>
          <p>We implement industry-standard security measures to protect your data. Verification documents are stored securely and never publicly displayed.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">4. Sharing</h2>
          <p>We do not sell your data. We share information only as needed for service operation and legal compliance.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">5. Your Rights</h2>
          <p>You can request data export, deletion, and correction at any time by contacting support.</p>
        </section>
      </div>
    </div>
  );
}
