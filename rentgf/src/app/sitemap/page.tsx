import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sitemap | RentGF",
};

export default function SitemapPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Sitemap</h1>
      <ul className="space-y-2">
        {[
          "/", "/discover", "/book", "/messages", "/favorites",
          "/login", "/register", "/companion/onboarding",
          "/companion/dashboard", "/customer/dashboard", "/admin/dashboard",
          "/cities", "/categories", "/assistant",
          "/legal/terms", "/legal/privacy", "/legal/safety",
          "/legal/18plus", "/legal/non-sexual", "/legal/cancellation",
          "/legal/refund", "/legal/community", "/legal/contact",
        ].map((link) => (
          <li key={link}><a href={link} className="text-indigo-600 hover:underline">{link}</a></li>
        ))}
      </ul>
    </div>
  );
}
