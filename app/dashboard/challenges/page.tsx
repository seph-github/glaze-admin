import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ChallengeListPage() {
  const supabase = await createClient();
  const { data: challenges } = await supabase
    .from("challenges")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Challenges</h1>
        <Link
          href="/dashboard/challenges/new"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + New Challenge
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {challenges?.map((challenge) => (
          <div
            key={challenge.id}
            className="bg-white shadow p-4 rounded space-y-2"
          >
            <h2 className="text-lg font-semibold">{challenge.title}</h2>
            <p className="text-sm text-gray-500">{challenge.description}</p>
            <p className="text-xs">Prize: {challenge.prize ?? "None"}</p>
            <p className="text-xs">Status: {challenge.status}</p>
            <Link
              href={`/dashboard/challenges/${challenge.id}/edit`}
              className="text-blue-600 text-sm underline"
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
