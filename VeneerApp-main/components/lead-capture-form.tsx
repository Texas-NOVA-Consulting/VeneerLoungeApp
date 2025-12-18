"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Phone, User, Building2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface LeadCaptureFormProps {
  onSubmit: (data: LeadData) => void
  isDentistMode?: boolean
}

export interface LeadData {
  name: string
  email: string
  phone: string
  dentistName?: string
  dentistPractice?: string
  notes?: string
  marketingConsent: boolean
}

export function LeadCaptureForm({ onSubmit, isDentistMode = false }: LeadCaptureFormProps) {
  const [formData, setFormData] = useState<LeadData>({
    name: "",
    email: "",
    phone: "",
    dentistName: "",
    dentistPractice: "",
    notes: "",
    marketingConsent: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Submit lead data
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to submit")

      toast({
        title: "Success!",
        description: "Your information has been saved.",
      })

      onSubmit(formData)
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Failed to save your information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              placeholder="John Smith"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="pl-10 bg-background/50"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="pl-10 bg-background/50"
              required
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="pl-10 bg-background/50"
            />
          </div>
        </div>

        {/* Dentist Information (Patient Mode) */}
        {!isDentistMode && (
          <>
            <div className="space-y-2">
              <Label htmlFor="dentistName">Your Dentist's Name (Optional)</Label>
              <Input
                id="dentistName"
                placeholder="Dr. Sarah Johnson"
                value={formData.dentistName}
                onChange={(e) => setFormData({ ...formData, dentistName: e.target.value })}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dentistPractice">Dental Practice Name (Optional)</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="dentistPractice"
                  placeholder="Smile Dental Care"
                  value={formData.dentistPractice}
                  onChange={(e) => setFormData({ ...formData, dentistPractice: e.target.value })}
                  className="pl-10 bg-background/50"
                />
              </div>
            </div>
          </>
        )}

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Any questions or special requirements..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="min-h-[100px] bg-background/50"
          />
        </div>

        {/* Marketing Consent */}
        <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/30 p-4">
          <Checkbox
            id="consent"
            checked={formData.marketingConsent}
            onCheckedChange={(checked) => setFormData({ ...formData, marketingConsent: checked as boolean })}
          />
          <Label htmlFor="consent" className="cursor-pointer text-sm leading-relaxed">
            I agree to receive updates about my simulation results and occasional marketing communications from
            VeneerVision AI. You can unsubscribe at any time.
          </Label>
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Continue to Results"}
      </Button>
    </form>
  )
}
