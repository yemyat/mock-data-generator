import { JSONValue } from '../types/json'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Copy, Check } from 'lucide-react'

interface JSONPreviewProps {
  data: JSONValue
}

export function JSONPreview({ data }: JSONPreviewProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">JSON Preview</h2>
        <Button onClick={copyToClipboard} variant="outline" size="sm">
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy JSON
            </>
          )}
        </Button>
      </div>
      <pre className="bg-muted p-4 rounded-lg overflow-auto flex-grow text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}

