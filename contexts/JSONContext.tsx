"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { JSONObject } from "@/types/json";

interface JSONContextType {
  inputJsonData: JSONObject;
  setInputJsonData: (data: JSONObject) => void;
  outputJsonData: JSONObject;
  setOutputJsonData: (data: JSONObject) => void;
  initialData: JSONObject | null;
  setInitialData: (data: JSONObject | null) => void;
  context: string;
  setContext: (context: string) => void;
}

const JSONContext = createContext<JSONContextType | undefined>(undefined);

export function JSONProvider({ children }: { children: ReactNode }) {
  const [inputJsonData, setInputJsonData] = useState<JSONObject>({});
  const [outputJsonData, setOutputJsonData] = useState<JSONObject>({});
  const [context, setContext] = useState<string>("");
  const [initialData, setInitialData] = useState<JSONObject | null>(null);

  return (
    <JSONContext.Provider
      value={{
        inputJsonData,
        setInputJsonData,
        outputJsonData,
        setOutputJsonData,
        initialData,
        setInitialData,
        context,
        setContext,
      }}
    >
      {children}
    </JSONContext.Provider>
  );
}

export function useJSON() {
  const context = useContext(JSONContext);
  if (context === undefined) {
    throw new Error("useJSON must be used within a JSONProvider");
  }
  return context;
}
