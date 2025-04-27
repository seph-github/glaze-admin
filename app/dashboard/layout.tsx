import DashboardFooter from '@/components/Dashboard/Footer';
import DashboardHeader from '@/components/Dashboard/Header';
import { DashboardSidebar } from '@/components/Dashboard/Sidebar';
import TopLoadingBar from '@/components/ui/TopLoadingBar';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <body>
      <TopLoadingBar />
      <div className="flex">
        <DashboardSidebar />
        <div className="ml-64 w-full min-h-screen flex flex-col bg-background">
          <DashboardHeader />
          <main className="flex-1 p-6">{children}</main>
          <DashboardFooter />
        </div>
      </div>
    </body>
  );
}
