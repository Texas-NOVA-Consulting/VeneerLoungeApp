"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuizQuestion {
  id: string
  question: string
  options: {
    id: string
    label: string
    image?: string
    description?: string
  }[]
}

const quizQuestions: QuizQuestion[] = [
  {
    id: "style_preference",
    question: "What's your ideal smile style?",
    options: [
      {
        id: "natural",
        label: "Natural & Subtle",
        description: "A refined look that enhances your natural beauty",
      },
      {
        id: "hollywood",
        label: "Hollywood Glamour",
        description: "Bold, bright, and camera-ready",
      },
      {
        id: "warm",
        label: "Warm & Inviting",
        description: "Soft tones that radiate warmth",
      },
      {
        id: "professional",
        label: "Professional Polish",
        description: "Confident and sophisticated",
      },
    ],
  },
  {
    id: "brightness",
    question: "How bright do you want your smile?",
    options: [
      {
        id: "subtle",
        label: "Subtle Enhancement",
        description: "Just a touch brighter",
      },
      {
        id: "moderate",
        label: "Moderate Whitening",
        description: "Noticeable but natural",
      },
      {
        id: "dramatic",
        label: "Dramatic Transformation",
        description: "Maximum brightness",
      },
    ],
  },
  {
    id: "lifestyle",
    question: "Which best describes your lifestyle?",
    options: [
      {
        id: "professional",
        label: "Corporate Professional",
        description: "Business meetings and presentations",
      },
      {
        id: "creative",
        label: "Creative & Artistic",
        description: "Self-expression is important",
      },
      {
        id: "social",
        label: "Social Butterfly",
        description: "Always on the go, meeting people",
      },
      {
        id: "wellness",
        label: "Health & Wellness",
        description: "Natural beauty enthusiast",
      },
    ],
  },
  {
    id: "concerns",
    question: "What are your main smile concerns?",
    options: [
      {
        id: "color",
        label: "Discoloration",
        description: "Stained or yellowed teeth",
      },
      {
        id: "shape",
        label: "Tooth Shape",
        description: "Irregular or worn teeth",
      },
      {
        id: "gaps",
        label: "Gaps & Spacing",
        description: "Spaces between teeth",
      },
      {
        id: "overall",
        label: "Overall Appearance",
        description: "General smile enhancement",
      },
    ],
  },
]

interface SmileQuizProps {
  onComplete: (answers: Record<string, string>, recommendation: string) => void
  onBack?: () => void
}

export function SmileQuiz({ onComplete, onBack }: SmileQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const isLastQuestion = currentQuestion === quizQuestions.length - 1
  const currentQ = quizQuestions[currentQuestion]
  const hasAnswer = answers[currentQ.id] !== undefined

  const handleAnswer = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionId,
    }))
  }

  const handleNext = () => {
    if (isLastQuestion) {
      const recommendation = getRecommendation(answers)
      onComplete(answers, recommendation)
    } else {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    } else {
      onBack?.()
    }
  }

  const getRecommendation = (answers: Record<string, string>): string => {
    const styleMap: Record<string, string> = {
      natural: "natural_white",
      hollywood: "hollywood_white",
      warm: "warm_ivory",
      professional: "pearl_white",
    }

    const brightnessMap: Record<string, string> = {
      subtle: "natural_white",
      moderate: "pearl_white",
      dramatic: "ultra_white",
    }

    const style = answers.style_preference
    const brightness = answers.brightness

    // Logic to determine best shade
    if (brightness === "dramatic") return "ultra_white"
    if (style === "hollywood") return "hollywood_white"
    if (style === "warm") return "warm_ivory"
    if (brightness === "subtle") return "natural_white"

    return styleMap[style] || brightnessMap[brightness] || "natural_white"
  }

  return (
    <div className="space-y-8">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </span>
          <span className="font-medium">{Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="text-center">
        <h2 className="mb-3 text-3xl font-bold text-balance">{currentQ.question}</h2>
        <p className="text-muted-foreground">Select the option that best describes you</p>
      </div>

      {/* Options */}
      <div className="grid gap-4 sm:grid-cols-2">
        {currentQ.options.map((option) => {
          const isSelected = answers[currentQ.id] === option.id

          return (
            <button
              key={option.id}
              onClick={() => handleAnswer(option.id)}
              className={cn(
                "glass relative flex flex-col items-start rounded-xl p-6 text-left transition-all hover:border-primary/50",
                isSelected ? "border-2 border-primary" : "border border-border",
              )}
            >
              {isSelected && (
                <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                  <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                </div>
              )}

              <div className="mb-2 text-lg font-semibold">{option.label}</div>
              {option.description && <div className="text-sm text-muted-foreground">{option.description}</div>}
            </button>
          )
        })}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button onClick={handlePrevious} variant="outline" className="flex-1 bg-transparent">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {currentQuestion === 0 ? "Back to Upload" : "Previous"}
        </Button>
        <Button onClick={handleNext} disabled={!hasAnswer} className="flex-1">
          {isLastQuestion ? "Get Recommendation" : "Next Question"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
