import { useState } from 'react';
import { useGenerateAnswer, useGetAnswer } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2, CheckCircle2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface AnswerGenerationProps {
  riddleText: string;
}

export function AnswerGeneration({ riddleText }: AnswerGenerationProps) {
  const [imageClueIdsInput, setImageClueIdsInput] = useState('');
  const [generatedAnswerId, setGeneratedAnswerId] = useState<bigint | null>(null);
  
  const generateMutation = useGenerateAnswer();
  const { data: generatedAnswer, isLoading: answerLoading } = useGetAnswer(generatedAnswerId);

  const parseImageClueIds = (input: string): bigint[] => {
    if (!input.trim()) return [];
    
    return input
      .split(',')
      .map(id => id.trim())
      .filter(id => id !== '' && !isNaN(Number(id)))
      .map(id => BigInt(id));
  };

  const imageClueIds = parseImageClueIds(imageClueIdsInput);

  const handleGenerate = async () => {
    if (imageClueIds.length === 0) {
      toast.error('Please provide at least one image clue ID');
      return;
    }

    if (!riddleText.trim()) {
      toast.error('Please enter riddle text in the Riddle Text card above');
      return;
    }

    try {
      const answerId = await generateMutation.mutateAsync({
        imageClueIds,
        riddleText: riddleText.trim(),
      });
      setGeneratedAnswerId(answerId);
      toast.success(`Answer generated successfully! ID: ${answerId}`);
      setImageClueIdsInput('');
    } catch (error: any) {
      console.error('Generate error:', error);
      if (error.message?.includes('Unauthorized') || error.message?.includes('Anonymous')) {
        toast.error('You must be signed in to generate answers');
      } else {
        toast.error('Failed to generate answer. Please try again.');
      }
    }
  };

  const handleClearOutput = () => {
    setGeneratedAnswerId(null);
  };

  const isGenerating = generateMutation.isPending;
  const canGenerate = imageClueIds.length > 0 && riddleText.trim() !== '' && !isGenerating;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Generate Answer
        </CardTitle>
        <CardDescription>
          Analyze riddle text with multiple image clues
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="image-clue-ids">Image Clue IDs</Label>
          <Input
            id="image-clue-ids"
            type="text"
            placeholder="e.g., 1, 3, 5"
            value={imageClueIdsInput}
            onChange={(e) => setImageClueIdsInput(e.target.value)}
            disabled={isGenerating}
          />
          <p className="text-xs text-muted-foreground">
            Enter one or more image clue IDs separated by commas
          </p>
          {imageClueIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {imageClueIds.map((id) => (
                <Badge key={id.toString()} variant="secondary">
                  ID: {id.toString()}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Button
          onClick={handleGenerate}
          disabled={!canGenerate}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : generateMutation.isSuccess ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Generated
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Answer
            </>
          )}
        </Button>

        {/* Output Section */}
        {generatedAnswerId !== null && (
          <>
            <Separator className="my-4" />
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Generated Answer</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearOutput}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Answer ID</div>
                <div className="font-mono text-sm bg-background px-3 py-2 rounded border">
                  {generatedAnswerId.toString()}
                </div>
              </div>

              {answerLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading answer details...
                </div>
              ) : generatedAnswer ? (
                <>
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Image Clue IDs Used</div>
                    <div className="flex flex-wrap gap-2">
                      {generatedAnswer.imageClueIds.map((id) => (
                        <Badge key={id.toString()} variant="outline">
                          {id.toString()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Answer Text</div>
                    <Textarea
                      value={generatedAnswer.answerText}
                      readOnly
                      rows={4}
                      className="resize-none bg-background"
                    />
                  </div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Answer details not available
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
