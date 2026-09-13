import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Guidelines | RentGF",
  description: "RentGF community guidelines for a safe and respectful environment.",
};

export default function CommunityPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Community Guidelines</h1>
      <div className="prose prose-indigo max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900">Be Respectful</h2>
          <p>Treat all users with respect and dignity. No harassment or discrimination.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">Be Honest</h2>
          <p>Provide accurate information. No misrepresentation or fake profiles.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">Stay Safe</h2>
          <p>Follow our safety guidelines. Report suspicious behavior immediately.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">Respect Privacy</h2>
          <p>Do not share other users&apos; information. Keep conversations private.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">Legal Compliance</h2>
          <p>All activities must be lawful. No illegal content or behavior.</p>
        </section>
      </div>
    </div>
  );
}
