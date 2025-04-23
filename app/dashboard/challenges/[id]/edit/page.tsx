import EditChallengeForm from '@/components/challenges/EditChallengeForm';
import { createClient } from '@/lib/supabase/server';
import { Challenge } from '@/types/interfaces/Challenge';
import { notFound } from 'next/navigation';

export default async function EditChallengePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: challenge } = await supabase
    .from('challenges')
    .select('*')
    .eq('id', id)
    .single();

  if (!challenge) return notFound();

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Edit Challenge</h1>
      <EditChallengeForm challenge={challenge as Challenge} />
    </div>
  );
}
