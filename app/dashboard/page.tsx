import AnalyticsSummary from '@/components/Dashboard/AnalyticsSummary';
import FlaggedContent from '@/components/Dashboard/FlaggedContent';
import Leaderboard from '@/components/Dashboard/Leaderboard';
import QuickActions from '@/components/Dashboard/QuickAction';
import UpcomingChallenges from '@/components/Dashboard/UpcomingChallenges';

export default async function Page() {
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
