"use client";

import { Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useJSON } from "@/contexts/JSONContext";
import { generateData } from "@/app/actions";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

export interface Model {
  value: string;
  label: string;
  provider: string;
}

export const modelOptions: Model[] = [
  {
    value: "claude-3-5-sonnet-latest",
    label: "Claude 3.5 Sonnet",
    provider: "anthropic",
  },
  {
    value: "claude-3-5-haiku-latest",
    label: "Claude 3.5 Haiku",
    provider: "anthropic",
  },
  { value: "gpt-4o", label: "GPT 4o", provider: "openai" },
  { value: "gpt-4o-mini", label: "GPT 4o Mini", provider: "openai" },
];

export function NavBar() {
  const { inputJsonData, context, setOutputJsonData: setJsonData } = useJSON();
  const [model, setModel] = useState<Model>(modelOptions[0]);
  const [apiKey, setApiKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Load saved values from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem("apiKey");
    const savedModelValue = localStorage.getItem("selectedModel");

    if (savedApiKey) {
      setApiKey(savedApiKey);
    }

    if (savedModelValue) {
      const savedModel = modelOptions.find((m) => m.value === savedModelValue);
      if (savedModel) {
        setModel(savedModel);
      }
    }
  }, []);

  // Save API key to localStorage when it changes
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
    localStorage.setItem("apiKey", newApiKey);
  };

  // Save model selection to localStorage when it changes
  const handleModelChange = (value: string) => {
    const newModel = modelOptions.find((m) => m.value === value)!;
    setModel(newModel);
    localStorage.setItem("selectedModel", value);
  };

  const handleGenerateData = async () => {
    try {
      setIsLoading(true);
      const result = await generateData(inputJsonData, context, model, apiKey);
      if (result.success) {
        if (result.result) {
          const jsonResult = JSON.parse(result.result);
          setJsonData(jsonResult);
        }
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to generate data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="border-b bg-white">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">Mock Data Generator</h1>
          <span className="text-sm text-muted-foreground">
            Generate mock data from your JSON schema
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Input
            type="password"
            placeholder="Enter API Key"
            className="w-64"
            value={apiKey}
            onChange={handleApiKeyChange}
          />
          <Select value={model.value} onValueChange={handleModelChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {modelOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="default"
            className="flex flex-row space-x-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white border-0"
            onClick={handleGenerateData}
            disabled={isLoading}
          >
            <Sparkles size={16} className={isLoading ? "animate-spin" : ""} />
            {isLoading ? "Generating..." : "Generate Data"}
          </Button>
        </div>
      </div>
    </nav>
  );
}
