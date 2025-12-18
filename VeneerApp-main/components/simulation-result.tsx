"use client"

import { Download, Share2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SimulationResultProps {
  originalImage: string
  simulatedImages: string[]
  shade: string
  onDownload?: () => void
  onGenerateReport?: () => void
}

export function SimulationResult({
  originalImage,
  simulatedImages,
  shade,
  onDownload,
  onGenerateReport,
}: SimulationResultProps) {
  const handleDownload = (imageUrl: string, index: number) => {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `veneer-simulation-${index + 1}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="mb-2 text-3xl font-bold">Your Veneer Simulation</h2>
        <p className="text-muted-foreground">Compare your original smile with the AI-generated results</p>
      </div>

      {/* Comparison View */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Original */}
        <div className="glass overflow-hidden rounded-2xl p-4">
          <div className="mb-3 text-center">
            <span className="inline-block rounded-full bg-muted px-3 py-1 text-sm font-medium">Original</span>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <img
              src={originalImage || "/placeholder.svg"}
              alt="Original smile"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Simulated */}
        {simulatedImages.map((image, index) => (
          <div key={index} className="glass relative overflow-hidden rounded-2xl p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="inline-block rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary">
                With Veneers - {shade}
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => handleDownload(image, index)}
                aria-label="Download image"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <img
                src={image || "/placeholder.svg"}
                alt={`Simulated smile ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={onDownload} className="flex-1">
          <Download className="mr-2 h-4 w-4" />
          Download All Results
        </Button>
        <Button onClick={onGenerateReport} variant="outline" className="flex-1 bg-transparent">
          <FileText className="mr-2 h-4 w-4" />
          Generate PDF Report
        </Button>
        <Button variant="outline" className="bg-transparent">
          <Share2 className="mr-2 h-4 w-4" />
          Share Results
        </Button>
      </div>
    </div>
  )
}
