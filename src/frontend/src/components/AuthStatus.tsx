import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { LogIn, LogOut, Loader2 } from 'lucide-react';
import { formatPrincipal } from '../lib/principal';

export function AuthStatus() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <div className="flex items-center gap-3">
      {isAuthenticated && identity && (
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-mono bg-muted px-2 py-1 rounded">
            {formatPrincipal(identity.getPrincipal().toString())}
          </span>
        </div>
      )}
      <button
        onClick={handleAuth}
        disabled={isLoggingIn}
        className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3 ${
          isAuthenticated
            ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
            : 'bg-primary text-primary-foreground hover:bg-primary/90'
        }`}
      >
        {isLoggingIn ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : isAuthenticated ? (
          <>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" />
            Sign in
          </>
        )}
      </button>
    </div>
  );
}
