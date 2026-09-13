import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Safety Guidelines | RentGF",
  description: "Stay safe on RentGF with our comprehensive safety guidelines.",
};

export default function SafetyPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Safety Guidelines</h1>
      <div className="prose prose-indigo max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900">General Safety</h2>
          <p>Always meet in public places initially. Share your location with a trusted friend. Trust your instincts.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">Before Meeting</h2>
          <p>Verify profiles through our platform. Check reviews and ratings. Communicate through our chat system.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">During Meeting</h2>
          <p>Maintain respectful boundaries. Do not share sensitive personal information. Stay aware of your surroundings.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">Reporting</h2>
          <p>If anything feels unsafe, report immediately using our reporting tools. Your safety is our priority.</p>
        </section>
      </div>
    </div>
  );
}
