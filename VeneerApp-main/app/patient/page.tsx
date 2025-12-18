"use client"

import { useState } from "react"
import { ImageUpload } from "@/components/image-upload"
import { SmileQuiz } from "@/components/smile-quiz"
import { QuizResult } from "@/components/quiz-result"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function PatientPage() {
  const [step, setStep] = useState<"upload" | "quiz" | "result">("upload")
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [recommendation, setRecommendation] = useState<string>("")
  const router = useRouter()

  const handleImageSelect = (file: File, preview: string) => {
    setImageFile(file)
    setSelectedImage(preview)
  }

  const handleClearImage = () => {
    setImageFile(null)
    setSelectedImage("")
  }

  const handleQuizComplete = (answers: Record<string, string>, recommendedShade: string) => {
    setQuizAnswers(answers)
    setRecommendation(recommendedShade)
    setStep("result")
  }

  const handleContinueToSimulation = (shade: string) => {
    // Save image to localStorage
    if (selectedImage) {
      localStorage.setItem("uploadedPatientImage", selectedImage)
    }
    router.push(`/patient/simulation?shade=${shade}`)
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
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Patient Mode</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-12 flex items-center justify-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
              step === "upload" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            1
          </div>
          <div className={`h-0.5 w-16 ${step !== "upload" ? "bg-primary" : "bg-muted"}`} />
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
              step === "quiz" || step === "result"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            2
          </div>
          <div className={`h-0.5 w-16 ${step === "result" ? "bg-primary" : "bg-muted"}`} />
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
              step === "result" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            3
          </div>
        </div>

        {/* Step Content */}
        {step === "upload" && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="mb-3 text-4xl font-bold">Upload Your Smile Photo</h1>
              <p className="text-muted-foreground">
                Take or upload a clear photo of your smile to get started with your AI simulation
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
              <Button className="flex-1" disabled={!selectedImage} onClick={() => setStep("quiz")}>
                Continue to Quiz
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === "quiz" && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="mb-3 text-4xl font-bold">Discover Your Perfect Smile</h1>
              <p className="text-muted-foreground">
                Answer a few questions to get your personalized veneer recommendation
              </p>
            </div>

            <div className="glass rounded-2xl p-6 sm:p-8">
              <SmileQuiz onComplete={handleQuizComplete} onBack={() => setStep("upload")} />
            </div>
          </div>
        )}

        {step === "result" && (
          <div>
            <QuizResult recommendation={recommendation} onContinue={handleContinueToSimulation} />
          </div>
        )}
      </main>
    </div>
  )
}
