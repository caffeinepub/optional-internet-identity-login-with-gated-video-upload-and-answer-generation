import { AuthStatus } from './AuthStatus';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download } from 'lucide-react';

export function AppHeader() {
  const { isInstallable, promptInstall } = usePWAInstall();

  const handleInstallClick = async () => {
    await promptInstall();
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/assets/generated/logo.dim_512x512.png"
            alt="Riddle Solver Logo"
            className="h-10 w-10 object-contain"
          />
          <span className="text-xl font-bold tracking-tight">Riddle Solver</span>
        </div>
        <div className="flex items-center gap-3">
          {isInstallable && (
            <button
              onClick={handleInstallClick}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 gap-2"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Install on Android</span>
              <span className="sm:hidden">Install</span>
            </button>
          )}
          <AuthStatus />
        </div>
      </div>
    </header>
  );
}
