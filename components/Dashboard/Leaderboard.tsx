import { createClient } from "@/lib/supabase/server";

export default async function Leaderboard() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("users")
    .select("id, username, glaze_count")
    .order("glaze_count", { ascending: false })
    .limit(5);

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <h2 className="text-lg font-semibold mb-4">Top Glazers</h2>
      {users?.length ? (
        <ul className="space-y-2 text-sm">
          {users.map((user, index) => (
            <li key={user.id} className="flex justify-between">
              <span>
                #{index + 1} {user.username || `User ${user.id.slice(0, 6)}`}
              </span>
              <span className="text-gray-600">{user.glaze_count} 🍩</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">No data available.</p>
      )}
    </div>
  );
}
