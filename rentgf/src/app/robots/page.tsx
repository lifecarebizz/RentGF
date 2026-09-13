import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Robots.txt | RentGF",
};

export default function RobotsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <pre className="bg-gray-100 rounded-xl p-6 text-sm font-mono">
        {`User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: https://rentgf.com/sitemap`}
      </pre>
    </div>
  );
}
