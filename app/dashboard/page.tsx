import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";

export default async function Page() {
     const supabase = createClient(
      );
    
      
      const { data: { user } } = await (await supabase).auth.getUser();
    
    //   console.log('user ' + user)
    
      // 🚫 Already signed in? Redirect them
    //   if (!user) {
    //     // redirect('/auth/login'); // ✅ or wherever you want
    //   }
    
      console.log('dashboard user ' + user)


    return <h1> Hi From Dashboard!</h1>
}