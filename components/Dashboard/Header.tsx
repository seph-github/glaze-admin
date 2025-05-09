"use client";

import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import AvatarDropdown from "./AvatarDropdown";

export default function DashboardHeader() {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("profile_image_url")
          .eq("id", user.id)
          .single();

        if (!error && profile?.profile_image_url) {
          setProfileImage(profile.profile_image_url);
        }
      }
    };

    fetchProfileImage();
  }, []);

  return (
    <header className="h-16 border-b px-6 flex items-center justify-between bg-white dark:bg-zinc-900 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold capitalize text-foreground">
          {/* {pathname.replace('/', '') || 'Dashboard'} */}
        </h1>
      </div>

      <div className="flex items-center gap-3 relative">
        <span className="text-sm text-muted-foreground">Welcome, Admin</span>
        <AvatarDropdown profileImage={profileImage} />
      </div>
    </header>
  );
}
