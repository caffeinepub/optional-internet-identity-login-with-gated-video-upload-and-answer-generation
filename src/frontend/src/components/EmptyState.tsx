export function EmptyState() {
  return (
    <div className="max-w-3xl mx-auto text-center space-y-8 py-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to Riddle Solver</h1>
        <p className="text-xl text-muted-foreground">
          An AI-powered detective tool.
        </p>
      </div>

      <div className="relative rounded-lg overflow-hidden border bg-card shadow-lg">
        <img
          src="/assets/generated/empty-state.dim_1200x600.png"
          alt="Detective board with clues"
          className="w-full h-auto"
        />
      </div>

      <div className="space-y-4 text-left bg-card border rounded-lg p-6">
        <h2 className="text-2xl font-semibold">Get Started</h2>
        <ol className="space-y-3 text-muted-foreground">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
              1
            </span>
            <span>
              <strong className="text-foreground">Sign in</strong> with Internet Identity using the button above
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
              2
            </span>
            <span>
              <strong className="text-foreground">Upload video clues</strong> containing hidden riddles
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
              3
            </span>
            <span>
              <strong className="text-foreground">Generate answers</strong> and let AI solve the mystery
            </span>
          </li>
        </ol>
      </div>
    </div>
  );
}
