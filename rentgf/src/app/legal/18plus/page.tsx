import { Metadata } from "next";

export const metadata: Metadata = {
  title: "18+ Policy | RentGF",
  description: "RentGF is strictly 18+. Learn about our age verification and enforcement policies.",
};

export default function AgePolicyPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">18+ Policy</h1>
      <div className="prose prose-indigo max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900">Age Requirement</h2>
          <p>RentGF is strictly for individuals 18 years of age or older. This is a non-negotiable requirement.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">Age Verification</h2>
          <p>All users must confirm their age during registration. Companions go through additional verification.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">Enforcement</h2>
          <p>Violations of the age policy result in immediate account termination. We cooperate with authorities if needed.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">Zero Tolerance</h2>
          <p>Any content or behavior suggesting underage activity is strictly prohibited and will be reported to authorities.</p>
        </section>
      </div>
    </div>
  );
}
