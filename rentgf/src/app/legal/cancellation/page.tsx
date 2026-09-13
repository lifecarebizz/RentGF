import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cancellation Policy | RentGF",
  description: "Learn about RentGF's cancellation and refund policies.",
};

export default function CancellationPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Cancellation Policy</h1>
      <div className="prose prose-indigo max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900">Cancellation by Customer</h2>
          <p>Customers can cancel bookings before the scheduled time. Refunds are processed according to timing.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">Cancellation by Companion</h2>
          <p>Companions can cancel only under valid circumstances. Repeated cancellations affect profile standing.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">Refund Timeframes</h2>
          <p>Cancellations more than 24 hours before booking receive full refund. Within 24 hours may receive partial refund.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">Disputes</h2>
          <p>Disputed cancellations are reviewed by our team. Decision is final.</p>
        </section>
      </div>
    </div>
  );
}
