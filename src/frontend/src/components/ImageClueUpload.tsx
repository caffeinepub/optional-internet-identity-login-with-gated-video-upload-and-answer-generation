import { useState } from 'react';
import { useUploadImageClue } from '../hooks/useQueries';
import { ExternalBlob } from '../backend';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Image, Loader2, CheckCircle2, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FileQueueItem {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  clueId?: bigint;
  error?: string;
}

export function ImageClueUpload() {
  const [fileQueue, setFileQueue] = useState<FileQueueItem[]>([]);
  const uploadMutation = useUploadImageClue();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newItems: FileQueueItem[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not a valid image file`);
        continue;
      }
      
      newItems.push({
        file,
        id: `${Date.now()}-${i}`,
        status: 'pending',
        progress: 0,
      });
    }

    setFileQueue(prev => [...prev, ...newItems]);
    event.target.value = ''; // Reset input
  };

  const handleUpload = async (item: FileQueueItem) => {
    setFileQueue(prev =>
      prev.map(i => (i.id === item.id ? { ...i, status: 'uploading' as const, progress: 0 } : i))
    );

    try {
      const arrayBuffer = await item.file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        setFileQueue(prev =>
          prev.map(i => (i.id === item.id ? { ...i, progress: percentage } : i))
        );
      });

      const clueId = await uploadMutation.mutateAsync(blob);
      
      setFileQueue(prev =>
        prev.map(i =>
          i.id === item.id
            ? { ...i, status: 'success' as const, progress: 100, clueId }
            : i
        )
      );
      
      toast.success(`Image uploaded! Clue ID: ${clueId}`);
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error.message?.includes('Unauthorized') || error.message?.includes('Anonymous')
        ? 'You must be signed in to upload image clues'
        : 'Failed to upload image clue';
      
      setFileQueue(prev =>
        prev.map(i =>
          i.id === item.id
            ? { ...i, status: 'error' as const, error: errorMessage }
            : i
        )
      );
      
      toast.error(errorMessage);
    }
  };

  const handleRemove = (id: string) => {
    setFileQueue(prev => prev.filter(i => i.id !== id));
  };

  const handleClearAll = () => {
    setFileQueue([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Upload Image Clues
        </CardTitle>
        <CardDescription>
          Upload images containing hidden riddle clues
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="image-upload" className="cursor-pointer">
              <div className="text-sm text-muted-foreground">
                <span className="text-primary font-medium">Click to upload</span> or drag and drop
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                JPG, PNG, GIF, WEBP (max 10MB) - Multiple files supported
              </div>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {fileQueue.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">
                Upload Queue ({fileQueue.length})
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="h-8 text-xs"
              >
                <Trash2 className="mr-1 h-3 w-3" />
                Clear All
              </Button>
            </div>

            <ScrollArea className="h-[300px] rounded-md border p-3">
              <div className="space-y-3">
                {fileQueue.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg border bg-card space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {item.file.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {(item.file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(item.id)}
                        disabled={item.status === 'uploading'}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {item.status === 'uploading' && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Uploading...</span>
                          <span className="font-medium">{Math.round(item.progress)}%</span>
                        </div>
                        <Progress value={item.progress} />
                      </div>
                    )}

                    {item.status === 'success' && item.clueId && (
                      <div className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-muted-foreground">
                          Clue ID: <span className="font-mono font-medium">{item.clueId.toString()}</span>
                        </span>
                      </div>
                    )}

                    {item.status === 'error' && (
                      <div className="text-xs text-destructive">
                        {item.error || 'Upload failed'}
                      </div>
                    )}

                    {item.status === 'pending' && (
                      <Button
                        onClick={() => handleUpload(item)}
                        size="sm"
                        className="w-full h-8"
                      >
                        <Upload className="mr-2 h-3 w-3" />
                        Upload
                      </Button>
                    )}

                    {item.status === 'error' && (
                      <Button
                        onClick={() => handleUpload(item)}
                        size="sm"
                        variant="outline"
                        className="w-full h-8"
                      >
                        Retry
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
