"use client";

import { useEffect, useState } from "react";
import { JSONBuilder } from "../components/JSONBuilder";
import { JSONPaste } from "../components/JSONPaste";
import { JSONObject } from "../types/json";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { useJSON } from "@/contexts/JSONContext";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { useChat } from "ai/react";
import { Model, modelOptions } from "@/components/NavBar";
import { JSONPreview } from "@/components/JSONPreview";
export default function Home() {
  const {
    setInputJsonData,
    initialData,
    setInitialData,
    context,
    setContext,
    inputJsonData,
  } = useJSON();
  const [isJSONPasteOpen, setIsJSONPasteOpen] = useState(true);
  const [isContextOpen, setIsContextOpen] = useState(true);
  const [rowCount, setRowCount] = useState(10);
  const [apiKey, setApiKey] = useState<string>("");
  const [model, setModel] = useState<Model>(modelOptions[0]);

  useEffect(() => {
    const savedApiKey = localStorage.getItem("apiKey") || "";
    const savedModelValue = localStorage.getItem("selectedModel");

    // Set local state
    setApiKey(savedApiKey);
    if (savedModelValue) {
      const savedModel = modelOptions.find((m) => m.value === savedModelValue);
      if (savedModel) {
        setModel(savedModel);
      }
    }
  }, []);

  const { messages, setInput, isLoading, handleSubmit } = useChat({
    api: "/api/generate",
    body: {
      apiKey,
      model,
      context,
      schema: inputJsonData,
      rowCount,
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (inputJsonData) {
      setInput(JSON.stringify(inputJsonData, null, 2));
    }
  }, [inputJsonData, setInput]);

  const handleJSONPaste = (data: JSONObject) => {
    setInitialData(data);
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
          <JSONBuilder onUpdate={setInputJsonData} initialData={initialData} />
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
            <h2 className="text-lg font-medium">Import existing JSON schema</h2>
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
      <div className="w-1/2 flex flex-col bg-white">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1 mr-4">
              <div className="text-sm font-medium">
                Number of rows to generate: {rowCount}
              </div>
              <Slider
                value={[rowCount]}
                onValueChange={(value) => setRowCount(value[0])}
                max={50}
                min={1}
                step={1}
              />
            </div>
            <Button
              variant="default"
              className="flex flex-row space-x-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white border-0"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              <Sparkles size={16} className={isLoading ? "animate-spin" : ""} />
              <span>{isLoading ? "Generating..." : "Generate Data"}</span>
            </Button>
          </div>
        </div>
        <div className="w-full bg-white overflow-auto">
          <JSONPreview messages={messages} />
        </div>
      </div>
    </main>
  );
}
