"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CreateRoadmapButtonProps {
  onClick: () => void
}

export default function CreateRoadmapButton({ onClick }: CreateRoadmapButtonProps) {
  return (
    <Button onClick={onClick} className="gap-2">
      <Plus className="h-4 w-4" />
      Create Roadmap
    </Button>
  )
} 