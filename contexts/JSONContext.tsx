"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { JSONValue } from "@/types/json";

interface JSONContextType {
  outputJsonData: JSONValue;
  setOutputJsonData: (data: JSONValue) => void;
  initialData: JSONValue | null;
  setInitialData: (data: JSONValue | null) => void;
  context: string;
  setContext: (context: string) => void;
}

const JSONContext = createContext<JSONContextType | undefined>(undefined);

export function JSONProvider({ children }: { children: ReactNode }) {
  const [jsonData, setJsonData] = useState<JSONValue>({});
  const [context, setContext] = useState<string>("");
  const [initialData, setInitialData] = useState<JSONValue | null>(null);

  return (
    <JSONContext.Provider
      value={{
        outputJsonData: jsonData,
        setOutputJsonData: setJsonData,
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
