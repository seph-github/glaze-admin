'use client';

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client"; // Ensure this is your Supabase client instance
import { useRouter } from "next/navigation";

export default function AvatarDropdown({ profileImage }: { profileImage: string | null }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push("/auth/login"); // Redirect to the login page after logout
    } else {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-300 focus:outline-none"
      >
        {profileImage ? (
          <div className="relative w-full h-full">
            <Image
              src={profileImage}
              alt="Admin Avatar"
              sizes="auto"
              layout="fill"
              className="rounded-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm text-gray-500">No Image</span>
          </div>
        )}
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md shadow-lg z-20">
          <ul className="py-1">
            <li>
              <a
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
              >
                Profile
              </a>
            </li>
            <li>
              <a
                href="/settings"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
              >
                Settings
              </a>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}