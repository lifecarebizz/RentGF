import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cities | RentGF",
  description: "Discover companions in cities across India.",
};

export default function CitiesPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Cities</h1>
      <p className="text-gray-500 mb-8">Browse companions by city</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune", "Kolkata", "Jaipur"].map((city) => (
          <div key={city} className="bg-white rounded-xl border p-6 hover:shadow-sm transition-shadow cursor-pointer">
            <div className="text-lg font-semibold">{city}</div>
            <div className="text-sm text-gray-500 mt-1">Companions available</div>
          </div>
        ))}
      </div>
    </div>
  );
}
