"use client"

import { useState, useEffect } from "react"
import { VeneerShadeSelector } from "@/components/veneer-shade-selector"
import { SimulationLoading } from "@/components/simulation-loading"
import { SimulationResult } from "@/components/simulation-result"
import { LeadCaptureForm, type LeadData } from "@/components/lead-capture-form"
import { PDFReportGenerator } from "@/components/pdf-report-generator"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function SimulationPage() {
  const [selectedShade, setSelectedShade] = useState("natural_white")
  const [isGenerating, setIsGenerating] = useState(false)
  const [simulatedImages, setSimulatedImages] = useState<string[]>([])
  const [showLeadCapture, setShowLeadCapture] = useState(false)
  const [leadData, setLeadData] = useState<LeadData | null>(null)
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [originalImage, setOriginalImage] = useState<string>("/placeholder.svg?height=600&width=800")

  useEffect(() => {
    const stored = localStorage.getItem('uploadedPatientImage')
    console.log('DEBUG Frontend: stored image from localStorage:', stored?.substring(0, 100))
    if (stored) {
      setOriginalImage(stored)
    }
  }, [])

  const handleGenerate = async () => {
    if (!originalImage || originalImage.startsWith('/placeholder')) {
      alert('Please upload or capture an image first!');
      return;
    }
    if (!originalImage.startsWith('data:image/')) {
      alert('Invalid image format. Please upload a valid image.');
      return;
    }
    setIsGenerating(true)
    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: originalImage,
          shade: selectedShade,
          numOutputs: 1,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Simulation failed")
      }

      setSimulatedImages(Array.isArray(data.output) ? data.output : [data.output])
      setShowLeadCapture(true)
      toast({
        title: "Success!",
        description: "Your veneer simulation is ready.",
      })
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate simulation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleLeadSubmit = (data: LeadData) => {
    setLeadData(data)
    setShowLeadCapture(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-bold">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              VeneerVision AI
            </span>
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Patient Mode</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Lead Capture Modal */}
        {showLeadCapture && (
          <div className="mb-8 space-y-6">
            <div className="text-center">
              <h2 className="mb-2 text-3xl font-bold">Save Your Results</h2>
              <p className="text-muted-foreground">
                Enter your information to download your simulation and receive your PDF report
              </p>
            </div>

            <div className="glass mx-auto max-w-2xl rounded-2xl p-6 sm:p-8">
              <LeadCaptureForm onSubmit={handleLeadSubmit} />
            </div>
          </div>
        )}

        {/* Simulation Configuration */}
        {!isGenerating && simulatedImages.length === 0 && !showLeadCapture && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="mb-3 text-4xl font-bold">Customize Your Simulation</h1>
              <p className="text-muted-foreground">Select your preferred veneer shade and generate your preview</p>
            </div>

            <div className="glass rounded-2xl p-6">
              <VeneerShadeSelector onShadeSelect={setSelectedShade} selectedShade={selectedShade} />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" asChild>
                <Link href="/patient">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Link>
              </Button>
              <Button className="flex-1" onClick={handleGenerate}>
                Generate Simulation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {isGenerating && <SimulationLoading />}

        {/* Results with PDF Generator */}
        {!isGenerating && simulatedImages.length > 0 && !showLeadCapture && (
          <div className="space-y-8">
            <SimulationResult
              originalImage={originalImage}
              simulatedImages={simulatedImages}
              shade={selectedShade}
              onDownload={() => {
                simulatedImages.forEach((img, i) => {
                  const link = document.createElement("a")
                  link.href = img
                  link.download = `veneer-simulation-${i + 1}.jpg`
                  link.click()
                })
              }}
            />

            {leadData && (
              <PDFReportGenerator
                patientInfo={leadData}
                simulationData={{
                  shade: selectedShade,
                  originalImage,
                  simulatedImages,
                }}
              />
            )}
          </div>
        )}
      </main>
    </div>
  )
}
