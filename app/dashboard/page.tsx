import AnalyticsSummary from '../../components/dashboard/AnalyticsSummary';
import FlaggedContent from '../..//components/dashboard/FlaggedContent';
import Leaderboard from '../..//components/dashboard/Leaderboard';
import QuickActions from '../..//components/dashboard/QuickAction';
import UpcomingChallenges from '../..//components/dashboard/UpcomingChallenges';

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
