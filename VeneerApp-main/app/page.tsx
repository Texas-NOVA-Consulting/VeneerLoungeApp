import { HeroSection } from "@/components/hero-section"
import { ModeSelector } from "@/components/mode-selector"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <ModeSelector />
    </main>
  )
}
