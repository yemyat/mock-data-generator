"use client";

import { useState } from "react";
import { JSONBuilder } from "../components/JSONBuilder";
import { JSONPreview } from "../components/JSONPreview";
import { JSONPaste } from "../components/JSONPaste";
import { JSONValue } from "../types/json";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useJSON } from "@/contexts/JSONContext";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const {
    jsonData,
    setJsonData,
    initialData,
    setInitialData,
    context,
    setContext,
  } = useJSON();
  const [isJSONPasteOpen, setIsJSONPasteOpen] = useState(true);
  const [isContextOpen, setIsContextOpen] = useState(true);

  const handleJSONPaste = (data: JSONValue) => {
    setInitialData(data);
    setJsonData(data);
    setIsJSONPasteOpen(false);
  };

  const toggleJSONPaste = () => {
    setIsJSONPasteOpen(!isJSONPasteOpen);
  };

  const toggleContext = () => {
    setIsContextOpen(!isContextOpen);
  };

  return (
    <main className="flex-1 flex overflow-hidden">
      <div className="w-1/2 border-r flex flex-col">
        <div className="flex-1 overflow-auto bg-background">
          <JSONBuilder onUpdate={setJsonData} initialData={initialData} />
        </div>
        <div className="border-b border-t bg-white">
          <div className="p-4 flex items-center justify-between border-b">
            <h2 className="text-lg font-medium">Add context</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleContext}
              className="flex items-center space-x-2"
            >
              {isContextOpen ? (
                <>
                  <ChevronUp size={16} />
                  Collapse
                </>
              ) : (
                <>
                  <ChevronDown size={16} />
                  Expand
                </>
              )}
            </Button>
          </div>
          {isContextOpen && (
            <div className="p-4 border-b">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Add some background context to your application so that AI can understand the data you're trying to generate better"
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      className="h-24 text-sm bg-white"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <div className="p-4 flex items-center justify-between border-b">
            <h2 className="text-lg font-medium">Or start with existing JSON</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleJSONPaste}
              className="flex items-center space-x-2"
            >
              {isJSONPasteOpen ? (
                <>
                  <ChevronUp size={16} />
                  Collapse
                </>
              ) : (
                <>
                  <ChevronDown size={16} />
                  Expand
                </>
              )}
            </Button>
          </div>
          {isJSONPasteOpen && (
            <div className="p-4">
              <Card>
                <CardContent className="p-4">
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
