import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | RentGF",
  description: "RentGF Terms of Service - Read before using our companionship platform.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="prose prose-indigo max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
          <p>By using RentGF, you agree to these terms. We can update these terms at any time with notice.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">2. Eligibility</h2>
          <p>You must be 18 years or older to use RentGF. We strictly prohibit underage usage.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">3. Non-Sexual Companionship</h2>
          <p>RentGF is strictly for non-sexual social activities. Prostitution, sexual services, and related activities are strictly prohibited.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">4. User Conduct</h2>
          <p>Users must behave respectfully. Harassment, fraud, and inappropriate behavior will result in account termination.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">5. Payments</h2>
          <p>All payments are processed through our platform. Refund policies apply as outlined separately.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">6. Limitation of Liability</h2>
          <p>RentGF is a marketplace platform. We are not responsible for interactions between users.</p>
        </section>
      </div>
    </div>
  );
}
