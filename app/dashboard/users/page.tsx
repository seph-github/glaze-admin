import UserList from '@/components/Users/UserList';
import { createClient } from '@/lib/supabase/server';
import { Profile } from '@/types/interfaces/Profile';

export default async function UserPage() {
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  return <UserList profiles={profiles as Profile[]} />;
}
