import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-14 flex items-center justify-between px-4 border-b">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold">Staff Portal</h1>
          <div className="text-sm text-muted-foreground">Authentication</div>
        </div>
        <ThemeToggle />
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">{children}</div>
      </main>
      <footer className="h-14 flex items-center justify-center border-t">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Staff Portal. All rights reserved.
        </p>
      </footer>
    </div>
  );
} 