import { useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { EmptyState } from './components/EmptyState';
import { VideoClueUpload } from './components/VideoClueUpload';
import { ImageClueUpload } from './components/ImageClueUpload';
import { AudioClueUpload } from './components/AudioClueUpload';
import { AnswerGeneration } from './components/AnswerGeneration';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { ProfileSetupDialog } from './components/ProfileSetupDialog';
import { ScrollText, X } from 'lucide-react';

export default function App() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  // Riddle text state
  const [riddleText, setRiddleText] = useState('');

  // Show profile setup if authenticated but no profile exists
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleClearRiddle = () => {
    setRiddleText('');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {!isAuthenticated ? (
          <EmptyState />
        ) : (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Riddle Solver</h1>
              <p className="text-muted-foreground text-lg">
                Upload clues and let AI uncover the hidden riddle
              </p>
            </div>

            {/* Riddle Text Input */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
                  <ScrollText className="h-5 w-5" />
                  Riddle Text
                </h3>
                <p className="text-sm text-muted-foreground">
                  Enter the riddle you want to solve
                </p>
              </div>
              <div className="p-6 pt-0 space-y-4">
                <div className="space-y-2">
                  <label htmlFor="riddle-text" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Your Riddle
                  </label>
                  <textarea
                    id="riddle-text"
                    placeholder="Type or paste your riddle here..."
                    value={riddleText}
                    onChange={(e) => setRiddleText(e.target.value)}
                    rows={6}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the riddle text that you want to analyze with the uploaded clues
                  </p>
                </div>
                {riddleText && (
                  <button
                    onClick={handleClearRiddle}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 w-full"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear Riddle
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <VideoClueUpload />
              <ImageClueUpload />
              <AudioClueUpload />
              <AnswerGeneration riddleText={riddleText} />
            </div>
          </div>
        )}
      </main>

      <footer className="border-t py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} · Built with love using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      {showProfileSetup && <ProfileSetupDialog />}
    </div>
  );
}
