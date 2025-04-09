import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Volume2 } from "lucide-react"

interface VocabularyListProps {
  video: any
}

export function VocabularyList({ video }: VocabularyListProps) {
  if (!video.vocabulary || video.vocabulary.length === 0) {
    return (
      <div className="text-center py-4 bg-muted/20 rounded-md">
        <p className="text-muted-foreground">No vocabulary available for this video.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">German</TableHead>
            <TableHead>English</TableHead>
            <TableHead className="hidden md:table-cell">Example</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {video.vocabulary.map((word: any, index: number) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{word.german}</TableCell>
              <TableCell>{word.english}</TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">{word.example || "-"}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Volume2 className="h-4 w-4" />
                  <span className="sr-only">Pronounce</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
