import packageJson from "../../package.json";

export default function DashboardFooter() {
  return (
    <footer className="border-t px-6 py-4 text-xs text-muted-foreground text-center bg-white dark:bg-zinc-900">
      © {new Date().getFullYear()} Glaze Media, LLC — All rights reserved.
      <span className="ml-2 text-gray-400">v{packageJson.version}</span>
    </footer>
  );
}
