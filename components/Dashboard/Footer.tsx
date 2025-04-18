export default function DashboardFooter() {
    return (
    <footer className="border-t px-6 py-4 text-xs text-muted-foreground text-center bg-white dark:bg-zinc-900">
      © {new Date().getFullYear()} Glaze Admin — All rights reserved.
    </footer>
  );
}