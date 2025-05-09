import { LoginForm } from '@/components/login-form';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Page() {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  console.log('user ' + user?.id);

  // 🚫 Already signed in? Redirect them
  if (user) {
    redirect('/dashboard'); // ✅ or wherever you want
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
