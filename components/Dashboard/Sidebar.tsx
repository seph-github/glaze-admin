'use client';

import { Home, Users, Video, Trophy } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import  Image  from 'next/image';
import { LogoutButton } from '../logout-button';

const navItems = [
  { label: 'Home', href: '/dashboard/home', icon: Home },
  { label: 'Users', href: '/dashboard/users', icon: Users },
  { label: 'Videos', href: '/dashboard/videos', icon: Video },
  { label: 'Challenges', href: '/dashboard/challenges', icon: Trophy },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen border-r bg-white dark:bg-zinc-900 fixed top-0 left-0 z-10">
      <div className="h-16 flex items-center justify-center border-b">
        {/* <img src="../../public/glaze_icon_logo.png" /> */}
        <Image
        src="/glaze_icon_logo.png"
        alt='Glaze Logo'
        width={100}
        height={35}
         />
        {/* <span className="text-lg font-bold">🍩 Glaze Admin</span> */}
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-4 py-2 rounded-md transition hover:bg-muted',
                isActive ? 'bg-muted font-semibold text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      {/* <div className="p-4 border-t">
        <LogoutButton />
      </div> */}
    </aside>
  );
}