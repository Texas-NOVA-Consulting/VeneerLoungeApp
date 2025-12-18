"use client"

import { useState } from "react"
import { ImageUpload } from "@/components/image-upload"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DentistPage() {
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const router = useRouter()

  const handleImageSelect = (file: File, preview: string) => {
    setImageFile(file)
    setSelectedImage(preview)
  }

  const handleClearImage = () => {
    setImageFile(null)
    setSelectedImage("")
  }

  const handleContinue = () => {
    if (selectedImage) {
      localStorage.setItem("uploadedPatientImage", selectedImage);
    }
    router.push("/dentist/simulation")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-bold">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              VeneerVision AI
            </span>
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <div className="h-2 w-2 rounded-full bg-accent" />
            <span className="text-muted-foreground">Dentist Mode</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="mb-3 text-4xl font-bold">Professional Veneer Simulation</h1>
            <p className="text-muted-foreground">
              Upload patient photos and generate up to 4 AI-powered veneer variations
            </p>
          </div>

          <ImageUpload onImageSelect={handleImageSelect} selectedImage={selectedImage} onClear={handleClearImage} />

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 bg-transparent" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button className="flex-1" disabled={!selectedImage} onClick={handleContinue}>
              Continue to Simulation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
