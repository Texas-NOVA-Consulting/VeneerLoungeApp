import { Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Logo/Brand */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 backdrop-blur-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">AI-Powered Dental Technology</span>
        </div>

        {/* Main heading */}
        <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Transform Your Smile with{" "}
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            VeneerVision AI
          </span>
        </h1>

        {/* Subheading */}
        <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
          See your perfect smile before the procedure. Upload a photo, choose your veneer shade, and let our AI show you
          stunning, realistic results in seconds.
        </p>

        {/* Feature badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span>Instant AI Simulation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-accent" />
            <span>Multiple Veneer Shades</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-chart-3" />
            <span>Professional Reports</span>
          </div>
        </div>
      </div>
    </section>
  )
}
