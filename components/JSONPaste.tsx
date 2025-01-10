import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { JSONObject } from "../types/json";
import { ArrowUp } from "lucide-react";

interface JSONPasteProps {
  onPaste: (data: JSONObject) => void;
}

export function JSONPaste({ onPaste }: JSONPasteProps) {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handlePaste = () => {
    try {
      const parsedJSON = JSON.parse(jsonInput);
      if (
        typeof parsedJSON !== "object" ||
        parsedJSON === null ||
        Array.isArray(parsedJSON)
      ) {
        throw new Error("Input must be a JSON object");
      }
      onPaste(parsedJSON);
      setError(null);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Invalid JSON format – check your syntax and try again"
      );
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
        <ArrowUp size={16} />
        Import JSON
      </Button>
    </div>
  );
}
