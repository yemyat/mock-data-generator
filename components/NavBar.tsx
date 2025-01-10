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
import { useState } from "react";

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
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateData = async () => {
    try {
      setIsLoading(true);
      console.log(inputJsonData);
      const result = await generateData(inputJsonData, context, model);
      if (result.success) {
        if (result.result) {
          setJsonData(result.result);
        }
      } else {
        console.error("Generation failed:", result.error);
        // TODO: Show error message to user
      }
    } catch (error) {
      console.error("Error generating data:", error);
      // TODO: Show error message to user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="border-b bg-white">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">JSON Builder</h1>
          <span className="text-sm text-muted-foreground">
            Generate mock data from your JSON schema
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Input type="password" placeholder="Enter API Key" className="w-64" />
          <Select
            value={model.value}
            onValueChange={(value) =>
              setModel(modelOptions.find((m) => m.value === value)!)
            }
          >
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
