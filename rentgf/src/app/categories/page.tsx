import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories | RentGF",
  description: "Browse companionship categories and activities.",
};

export default function CategoriesPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Categories</h1>
      <p className="text-gray-500 mb-8">Explore different types of companionship</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: "Coffee & Conversation", icon: "☕", desc: "Connect over coffee" },
          { name: "Dining", icon: "🍽️", desc: "Enjoy meals together" },
          { name: "Events", icon: "🎭", desc: "Attend events together" },
          { name: "Sightseeing", icon: "🏛️", desc: "Explore new places" },
          { name: "Games", icon: "🎮", desc: "Play and have fun" },
          { name: "Hobbies", icon: "🎨", desc: "Share your hobbies" },
          { name: "Cultural Activities", icon: "🎶", desc: "Cultural experiences" },
          { name: "Public Outings", icon: "🌳", desc: "Outdoor activities" },
        ].map((c) => (
          <div key={c.name} className="bg-white rounded-xl border p-6 hover:shadow-sm transition-shadow">
            <div className="text-3xl mb-3">{c.icon}</div>
            <h3 className="font-semibold">{c.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
