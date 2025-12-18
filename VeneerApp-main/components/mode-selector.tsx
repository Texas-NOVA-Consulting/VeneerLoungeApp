"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { User, Stethoscope, ArrowRight } from "lucide-react"
import Link from "next/link"

export function ModeSelector() {
  const [hoveredMode, setHoveredMode] = useState<string | null>(null)

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight">Choose Your Experience</h2>
        <p className="mb-12 text-center text-muted-foreground">Select the mode that best fits your needs</p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Patient Mode */}
          <Link href="/patient">
            <div
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10"
              onMouseEnter={() => setHoveredMode("patient")}
              onMouseLeave={() => setHoveredMode(null)}
            >
              <div className="glass glass-shine relative z-10 rounded-xl p-6">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                  <User className="h-8 w-8 text-primary" />
                </div>

                <h3 className="mb-3 text-2xl font-bold">Patient Mode</h3>
                <p className="mb-6 text-muted-foreground leading-relaxed">
                  Discover your perfect smile with our guided quiz and AI simulation. Get personalized veneer
                  recommendations and instant previews.
                </p>

                <ul className="mb-6 space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Smile Style Quiz</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>1 AI Simulation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Downloadable Results</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>PDF Report</span>
                  </li>
                </ul>

                <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>

              {/* Glow effect */}
              <div
                className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary to-accent opacity-0 blur-xl transition-opacity duration-500 ${hoveredMode === "patient" ? "opacity-30" : ""}`}
              />
            </div>
          </Link>

          {/* Dentist Mode */}
          <Link href="/dentist">
            <div
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/10"
              onMouseEnter={() => setHoveredMode("dentist")}
              onMouseLeave={() => setHoveredMode(null)}
            >
              <div className="glass glass-shine relative z-10 rounded-xl p-6">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
                  <Stethoscope className="h-8 w-8 text-accent" />
                </div>

                <h3 className="mb-3 text-2xl font-bold">Dentist Mode</h3>
                <p className="mb-6 text-muted-foreground leading-relaxed">
                  Professional tools for dental practitioners. Generate multiple veneer variations and provide
                  comprehensive consultations.
                </p>

                <ul className="mb-6 space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    <span>Skip Quiz Option</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    <span>Up to 4 AI Variations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    <span>Advanced Controls</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    <span>Professional Reports</span>
                  </li>
                </ul>

                <Button
                  variant="outline"
                  className="w-full border-accent/50 group-hover:bg-accent group-hover:text-accent-foreground bg-transparent"
                >
                  Access Pro Tools
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>

              {/* Glow effect */}
              <div
                className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-accent to-primary opacity-0 blur-xl transition-opacity duration-500 ${hoveredMode === "dentist" ? "opacity-30" : ""}`}
              />
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
