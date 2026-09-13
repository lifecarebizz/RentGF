import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Non-Sexual Policy | RentGF",
  description: "RentGF is strictly for non-sexual companionship. Understand our policies.",
};

export default function NonSexualPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Non-Sexual Companionship Policy</h1>
      <div className="prose prose-indigo max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900">Our Purpose</h2>
          <p>RentGF facilitates lawful, non-sexual social companionship activities only.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">Prohibited Activities</h2>
          <p>Prostitution, sexual services, escort-for-sex arrangements, and sexual transactions are strictly prohibited.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">Appropriate Activities</h2>
          <p>Conversation, coffee, dining, events, sightseeing, games, hobbies, cultural activities, and public outings.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">Enforcement</h2>
          <p>Any violation results in immediate account termination. We actively monitor and enforce this policy.</p>
        </section>
      </div>
    </div>
  );
}
