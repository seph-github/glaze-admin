import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function UpcomingChallenges() {
  const supabase = await createClient();

  const { data: challenges } = await supabase
    .from('challenges')
    .select('*')
    .gt('start_date', new Date().toISOString())
    .order('start_date', { ascending: true })
    .limit(5);

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <h2 className="text-lg font-semibold mb-4">Upcoming Challenges</h2>
      {challenges?.length ? (
        <ul className="space-y-3">
          {challenges.map((challenge) => (
            <li
              key={challenge.id}
              className="flex justify-between items-center"
            >
              <span>{challenge.title}</span>
              <Link
                href={`/dashboard/challenges/${challenge.id}`}
                className="text-blue-600 hover:underline text-sm"
              >
                View
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">No upcoming challenges.</p>
      )}
    </div>
  );
}
