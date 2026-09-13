import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Assistant | RentGF",
  description: "Get help from RentGF's AI assistant.",
};

export default function AIAssistantPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Need Help?</h1>
      <div className="bg-white rounded-2xl border p-8 text-center">
        <p className="text-gray-500 mb-6">Our AI assistant can help you with FAQs, booking instructions, payment information, and more.</p>
        <div className="bg-gray-50 rounded-xl p-4 text-left">
          <p className="text-sm text-gray-500">Coming soon: Interactive AI assistant.</p>
        </div>
        <div className="mt-6">
          <h3 className="font-medium mb-3">Popular Topics</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {["How to book", "Payment options", "Cancellation policy", "Verification process", "Safety tips", "Platform rules"].map((t) => (
              <span key={t} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
