"use client";

import { useState } from "react";
import { JSONBuilder } from "../components/JSONBuilder";
import { JSONPreview } from "../components/JSONPreview";
import { JSONPaste } from "../components/JSONPaste";
import { JSONValue } from "../types/json";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Home() {
  const [jsonData, setJsonData] = useState<JSONValue>({});
  const [initialData, setInitialData] = useState<JSONValue | null>(null);
  const [isJSONPasteOpen, setIsJSONPasteOpen] = useState(true);

  const handleJSONPaste = (data: JSONValue) => {
    setInitialData(data);
    setJsonData(data);
    setIsJSONPasteOpen(false);
  };

  const toggleJSONPaste = () => {
    setIsJSONPasteOpen(!isJSONPasteOpen);
  };

  return (
    <main className="flex-1 flex overflow-hidden">
      <div className="w-1/2 border-r flex flex-col">
        <div className="flex-1 overflow-auto bg-background">
          <JSONBuilder onUpdate={setJsonData} initialData={initialData} />
        </div>
        <div className="border-b border-t bg-white">
          <div className="p-4 flex items-center justify-between border-b">
            <h2 className="text-lg font-medium">Or start with existing JSON</h2>
            <Button variant="outline" size="sm" onClick={toggleJSONPaste}>
              {isJSONPasteOpen ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" />
                  Collapse
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Expand
                </>
              )}
            </Button>
          </div>
          {isJSONPasteOpen && (
            <div className="p-4">
              <Card>
                <CardContent className="pt-4">
                  <JSONPaste onPaste={handleJSONPaste} />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      <div className="w-1/2 bg-white">
        <JSONPreview data={jsonData} />
      </div>
    </main>
  );
}
