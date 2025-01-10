"use client";

import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useEffect, useState } from "react";

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
  const [model, setModel] = useState<Model>(modelOptions[0]);
  const [apiKey, setApiKey] = useState<string>("");

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
        </div>
      </div>
    </nav>
  );
}
