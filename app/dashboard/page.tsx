import AnalyticsSummary from '@/components/dashboard/AnalyticsSummary';
import FlaggedContent from '@/components/dashboard/FlaggedContent';
import Leaderboard from '@/components/dashboard/Leaderboard';
import QuickActions from '@/components/dashboard/QuickAction';
import UpcomingChallenges from '@/components/dashboard/UpcomingChallenges';
import { createClient } from '@/lib/supabase/client';

export default async function Page() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  //   console.log('user ' + user)

  // 🚫 Already signed in? Redirect them
  //   if (!user) {
  //     // redirect('/auth/login'); // ✅ or wherever you want
  //   }

  console.log('dashboard user ' + user);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <AnalyticsSummary />
      <QuickActions />
      <UpcomingChallenges />
      <FlaggedContent />
      <Leaderboard />
    </div>
  );
}
