"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface JSONUploaderProps {
  onClose: () => void
  onUpload: (data: any) => void
}

export function JSONUploader({ onClose, onUpload }: JSONUploaderProps) {
  const [jsonText, setJsonText] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleUpload = () => {
    try {
      const data = JSON.parse(jsonText)
      onUpload(data)
      setError(null)
    } catch (err) {
      setError("Invalid JSON format. Please check your input.")
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload JSON Data</DialogTitle>
          <DialogDescription>
            Paste your JSON data below to update the video content, learning tools, or add new videos.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <Textarea
            placeholder="Paste your JSON here..."
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />

          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-1">Example JSON Format:</p>
            <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
              {`{
  "videos": [
    {
      "id": "1",
      "title": "Basic German Greetings",
      "description": "Learn common German greetings",
      "level": "A1",
      "topic": "Vocabulary",
      "videoId": "youtube-id-here"
    }
  ],
  "videoContent": {
    "subtitles": [
      { "startTime": "0:00", "endTime": "0:05", "text": "Hallo! Wie geht's?" }
    ],
    "vocabulary": [
      { "german": "Hallo", "english": "Hello", "example": "Hallo, wie geht's?" }
    ],
    "quiz": {
      "questions": [
        {
          "question": "How do you say 'hello' in German?",
          "options": ["Hallo", "Tschüss", "Danke", "Bitte"],
          "answer": 0
        }
      ]
    }
  }
}`}
            </pre>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleUpload}>Upload</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
