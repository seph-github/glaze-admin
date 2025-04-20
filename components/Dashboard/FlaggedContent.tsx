import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function FlaggedContent() {
  const supabase = await createClient();
  const { data: flagged } = await supabase
    .from('flags')
    .select('id, video_id, reason, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <h2 className="text-lg font-semibold mb-4">Flagged Content</h2>
      {flagged?.length ? (
        <ul className="space-y-3">
          {flagged.map((flag) => (
            <li
              key={flag.id}
              className="flex justify-between items-center text-sm"
            >
              <span>
                Video #{flag.video_id} - {flag.reason}
              </span>
              <Link
                href={`/dashboard/videos/${flag.video_id}`}
                className="text-red-600 hover:underline"
              >
                Review
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">No flags reported.</p>
      )}
    </div>
  );
}
