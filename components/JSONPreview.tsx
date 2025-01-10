import { JSONValue } from "../types/json";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface JSONPreviewProps {
  data: JSONValue;
}

export function JSONPreview({ data }: JSONPreviewProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">Generated Data</h2>
        <div className="flex flex-row space-x-2">
          <Button
            onClick={copyToClipboard}
            variant="outline"
            size="sm"
            className="flex flex-row space-x-2"
          >
            {copied ? (
              <>
                <Check size={16} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy JSON
              </>
            )}
          </Button>
        </div>
      </div>
      <pre className="bg-muted p-4 rounded-lg overflow-auto flex-grow text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
