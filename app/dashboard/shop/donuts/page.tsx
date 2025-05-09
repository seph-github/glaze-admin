import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";

export default async function DonutsPage() {
  const supabase = await createClient();

  // Fetch all donuts from the database
  const { data: donuts, error } = await supabase
    .from("donuts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching donuts:", error.message);
    return <div className="text-red-500">Failed to load donuts.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Donuts</h1>
        <div className="flex gap-x-4">
          <Link
            href="/dashboard/shop/donuts/new"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition"
          >
            + Add New Donut
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {donuts?.map((donut) => (
          <div
            key={donut.id}
            className="bg-white shadow-md rounded-lg p-4 space-y-4"
          >
            {/* <img
              src={donut.image_url}
              alt={donut.name}
              className="w-full h-40 object-cover rounded"
            /> */}
            <Image
              src={donut.image_url}
              alt={donut.name}
              width={1000}
              height={1000}
              className="w-full h-40 object-cover rounded"
            />
            <h2 className="text-lg font-semibold text-gray-800">
              {donut.name}
            </h2>
            <p className="text-gray-600">{donut.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
