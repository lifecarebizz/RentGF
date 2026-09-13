import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | RentGF",
  description: "RentGF refund policy for payments and bookings.",
};

export default function RefundPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>
      <div className="prose prose-indigo max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900">Eligibility</h2>
          <p>Refunds are available for cancelled bookings, failed payments, and verified disputes.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">Processing Time</h2>
          <p>Refunds are processed within 5-7 business days after approval.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">Method</h2>
          <p>Refunds are issued to the original payment method.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900">Non-Refundable</h2>
          <p>Platform access fees may not be refundable after activation in certain cases.</p>
        </section>
      </div>
    </div>
  );
}
