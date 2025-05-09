import { createClient } from "@/lib/supabase/server";

export default async function AnalyticsSummary() {
  const supabase = await createClient();
  const { data: profiles } = await supabase.from("profiles").select();
  const { data: videos } = await supabase.from("videos").select("*");
  const { data: challenges } = await supabase
    .from("challenges")
    .select()
    .eq("status", "active");

  return (
    <div className="p-4 bg-white shadow rounded-md grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <p className="text-sm">Total Users</p>
        <h3 className="text-xl font-bold">{profiles?.length}</h3>
      </div>
      <div>
        <p className="text-sm">Videos</p>
        <h3 className="text-xl font-bold">{videos?.length}</h3>
      </div>
      <div>
        <p className="text-sm">Active Challenges</p>
        <h3 className="text-xl font-bold">{challenges?.length}</h3>
      </div>
      <div>
        <p className="text-sm">Donuts Sold</p>
        <h3 className="text-xl font-bold">124</h3>
      </div>
    </div>
  );
}
