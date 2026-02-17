import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Loader2 } from 'lucide-react';

export function ProfileSetupDialog() {
  const [name, setName] = useState('');
  const saveMutation = useSaveCallerUserProfile();

  const handleSave = async () => {
    if (!name.trim()) {
      return;
    }

    try {
      await saveMutation.mutateAsync({ name: name.trim() });
    } catch (error) {
      console.error('Profile save error:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-background border rounded-lg shadow-lg w-full max-w-md">
        <div className="flex flex-col space-y-1.5 p-6">
          <h2 className="text-lg font-semibold leading-none tracking-tight">Welcome!</h2>
          <p className="text-sm text-muted-foreground">
            Please tell us your name to complete your profile setup.
          </p>
        </div>
        <div className="p-6 pt-0 space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Your Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && name.trim()) {
                  handleSave();
                }
              }}
              disabled={saveMutation.isPending}
              autoFocus
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
        <div className="flex items-center p-6 pt-0">
          <button
            onClick={handleSave}
            disabled={!name.trim() || saveMutation.isPending}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
          >
            {saveMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Continue'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
