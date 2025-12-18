"use client"

import { Sparkles, CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QuizResultProps {
  recommendation: string
  onContinue: (shade: string) => void
}

const shadeInfo: Record<string, { name: string; description: string; benefits: string[] }> = {
  natural_white: {
    name: "Natural White",
    description: "A refined, subtle enhancement that complements your natural beauty.",
    benefits: [
      "Looks naturally beautiful",
      "Perfect for everyday wear",
      "Professional and approachable",
      "Easy to maintain",
    ],
  },
  hollywood_white: {
    name: "Hollywood White",
    description: "Bold, brilliant, and camera-ready for maximum impact.",
    benefits: ["Stunning in photos", "Maximum brightness", "Red carpet ready", "Confident and eye-catching"],
  },
  warm_ivory: {
    name: "Warm Ivory",
    description: "Soft, warm tones that create an inviting, friendly smile.",
    benefits: ["Warm and approachable", "Complements all skin tones", "Timeless elegance", "Naturally radiant"],
  },
  pearl_white: {
    name: "Pearl White",
    description: "An elegant, sophisticated look with subtle luminosity.",
    benefits: ["Professional polish", "Sophisticated appearance", "Perfect balance", "Universally flattering"],
  },
  ultra_white: {
    name: "Ultra White",
    description: "The brightest, most dramatic transformation possible.",
    benefits: ["Maximum impact", "Ultra-modern look", "Show-stopping smile", "Unforgettable impression"],
  },
}

export function QuizResult({ recommendation, onContinue }: QuizResultProps) {
  const info = shadeInfo[recommendation] || shadeInfo.natural_white

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Your Personalized Recommendation</span>
        </div>
        <h2 className="mb-3 text-4xl font-bold">{info.name}</h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">{info.description}</p>
      </div>

      <div className="glass rounded-2xl p-8">
        <h3 className="mb-4 text-xl font-semibold">Why This Shade is Perfect for You</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {info.benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
                <CheckCircle className="h-3 w-3 text-primary" />
              </div>
              <span className="text-sm">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-xl border border-primary/20 bg-primary/5 p-6">
        <h3 className="mb-2 font-semibold">What Happens Next?</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          We'll use your recommended shade to create an AI-powered simulation of your new smile. You can always adjust
          the shade if you'd like to see different options.
        </p>
      </div>

      <Button onClick={() => onContinue(recommendation)} className="w-full" size="lg">
        Continue to Simulation
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  )
}
