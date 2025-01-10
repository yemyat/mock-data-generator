import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { githubGist } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Message } from "ai";

export function JSONPreview({ messages }: { messages: Message[] }) {
  const [copied, setCopied] = useState(false);

  if (messages.length === 0) {
    return null;
  }

  // Don't show if the last message is not an assistant message
  if (messages[messages.length - 1].role !== "assistant") {
    return null;
  }

  const assistantMessage = messages[messages.length - 1];
  const copyToClipboard = () => {
    navigator.clipboard.writeText(assistantMessage.content);
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
      <SyntaxHighlighter
        language="json"
        style={githubGist}
        className="text-sm font-mono"
      >
        {assistantMessage.content}
      </SyntaxHighlighter>
    </div>
  );
}
