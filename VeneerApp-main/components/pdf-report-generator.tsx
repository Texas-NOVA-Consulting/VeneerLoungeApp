"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Download, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PDFReportGeneratorProps {
  patientInfo?: {
    name?: string
    email?: string
    phone?: string
  }
  simulationData: {
    shade: string
    originalImage: string
    simulatedImages: string[]
  }
}

export function PDFReportGenerator({ patientInfo, simulationData }: PDFReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handleGeneratePDF = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientInfo,
          simulationData,
          images: [simulationData.originalImage, ...simulationData.simulatedImages],
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "PDF generation failed")
      }

      toast({
        title: "PDF Report Generated!",
        description: "Your report is ready for download.",
      })

      // In a real app, trigger download
      // window.open(data.pdf.url, '_blank')
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate PDF report.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="glass space-y-4 rounded-2xl p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="mb-1 text-lg font-semibold">Professional PDF Report</h3>
          <p className="text-sm text-muted-foreground">
            Generate a comprehensive PDF report with before/after comparisons, recommended shade details, and
            professional notes.
          </p>
        </div>
      </div>

      <div className="space-y-2 rounded-lg border border-border/50 bg-muted/30 p-4 text-sm">
        <div className="font-medium">Report includes:</div>
        <ul className="space-y-1 text-muted-foreground">
          <li className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-primary" />
            <span>Before & After comparison images</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-primary" />
            <span>Veneer shade specifications</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-primary" />
            <span>Patient information and notes</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-primary" />
            <span>VeneerVision AI branding</span>
          </li>
        </ul>
      </div>

      <Button onClick={handleGeneratePDF} disabled={isGenerating} className="w-full" size="lg">
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            Generate PDF Report
          </>
        )}
      </Button>
    </div>
  )
}
