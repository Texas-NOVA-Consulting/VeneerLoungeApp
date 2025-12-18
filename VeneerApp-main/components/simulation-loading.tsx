"use client"

import { Loader2, Sparkles } from "lucide-react"

export function SimulationLoading() {
  return (
    <div className="glass flex min-h-[400px] flex-col items-center justify-center rounded-2xl p-12 text-center">
      <div className="mb-6 relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
          <Sparkles className="h-10 w-10 text-primary animate-pulse" />
        </div>
      </div>

      <h3 className="mb-2 text-2xl font-bold">Creating Your Perfect Smile</h3>
      <p className="mb-6 max-w-md text-muted-foreground">
        Our AI is analyzing your photo and applying the veneer simulation. This may take 30-60 seconds.
      </p>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Processing...</span>
      </div>

      <div className="mt-8 grid w-full max-w-md grid-cols-3 gap-4 text-xs">
        <div className="glass rounded-lg p-3">
          <div className="mb-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full w-full animate-pulse bg-primary" />
          </div>
          <div className="text-muted-foreground">Analyzing teeth</div>
        </div>
        <div className="glass rounded-lg p-3">
          <div className="mb-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full w-2/3 animate-pulse bg-primary animation-delay-200" />
          </div>
          <div className="text-muted-foreground">Applying veneers</div>
        </div>
        <div className="glass rounded-lg p-3">
          <div className="mb-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full w-1/3 animate-pulse bg-primary animation-delay-400" />
          </div>
          <div className="text-muted-foreground">Rendering</div>
        </div>
      </div>
    </div>
  )
}
