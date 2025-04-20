import { redirect } from 'next/navigation';

import { LogoutButton } from '@/components/logout-button';
import { createClient } from '@/lib/supabase/server';

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  // if (error || !data?.user) {
  //   redirect('/auth/login')
  //   return null
  // }

  let profileData = null;

  if (data?.user != null) {
    const { data: fetchedProfileData } = await supabase
      .from('profiles')
      .select()
      .eq('id', data?.user.id);
    profileData = fetchedProfileData;

    if (profileData?.[0]?.role === 'recruiter') {
      redirect('/auth/login');
      return null;
    }
  }

  console.log('here at protected auth login');

  return (
    <div className="flex h-svh w-full items-center justify-center gap-2">
      <p>
        Hello{' '}
        <span>
          {profileData?.[0]?.email || data?.user?.email || 'Guest'}{' '}
          <LogoutButton />
        </span>
      </p>
    </div>
  );
}
