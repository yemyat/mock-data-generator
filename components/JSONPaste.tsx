import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { JSONValue } from "../types/json";
import { ArrowRight, Eye } from "lucide-react";

interface JSONPasteProps {
  onPaste: (data: JSONValue) => void;
}

export function JSONPaste({ onPaste }: JSONPasteProps) {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handlePaste = () => {
    try {
      const parsedJSON = JSON.parse(jsonInput);
      onPaste(parsedJSON);
      setError(null);
    } catch {
      setError("Invalid JSON format – check your syntax and try again");
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Paste your JSON here to get started..."
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        className="h-40 font-mono text-sm bg-white"
      />
      {error && <p className="text-destructive text-sm">{error}</p>}
      <Button onClick={handlePaste} className="w-full">
        <Eye size={16} />
        Visualize JSON
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
