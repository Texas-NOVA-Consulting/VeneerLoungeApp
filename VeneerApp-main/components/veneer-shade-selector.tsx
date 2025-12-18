"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface VeneerShadeSelectorProps {
  onShadeSelect: (shade: string) => void
  selectedShade?: string
}

const shades = [
  { id: "natural_white", name: "Natural White", color: "#F8F6F0", description: "Subtle, natural-looking white" },
  { id: "hollywood_white", name: "Hollywood White", color: "#FFFFFF", description: "Bright, dazzling white" },
  { id: "warm_ivory", name: "Warm Ivory", color: "#FFF8E7", description: "Soft warm tone" },
  { id: "pearl_white", name: "Pearl White", color: "#FAF9F6", description: "Elegant pearl finish" },
  { id: "ultra_white", name: "Ultra White", color: "#FAFAFA", description: "Maximum brightness" },
]

export function VeneerShadeSelector({ onShadeSelect, selectedShade }: VeneerShadeSelectorProps) {
  const [selected, setSelected] = useState(selectedShade || "natural_white")

  const handleSelect = (shadeId: string) => {
    setSelected(shadeId)
    onShadeSelect(shadeId)
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-lg font-semibold">Select Veneer Shade</h3>
        <p className="text-sm text-muted-foreground">Choose the shade that matches your desired look</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {shades.map((shade) => (
          <button
            key={shade.id}
            onClick={() => handleSelect(shade.id)}
            className={cn(
              "glass relative flex items-center gap-4 rounded-xl p-4 text-left transition-all hover:border-primary/50",
              selected === shade.id ? "border-2 border-primary" : "border border-border",
            )}
          >
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2 border-border">
              <div className="h-full w-full" style={{ backgroundColor: shade.color }} />
            </div>

            <div className="flex-1">
              <div className="font-medium">{shade.name}</div>
              <div className="text-xs text-muted-foreground">{shade.description}</div>
            </div>

            {selected === shade.id && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                <Check className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
