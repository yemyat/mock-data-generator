"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { JSONValue } from "@/types/json";

interface JSONContextType {
  jsonData: JSONValue;
  setJsonData: (data: JSONValue) => void;
  initialData: JSONValue | null;
  setInitialData: (data: JSONValue | null) => void;
}

const JSONContext = createContext<JSONContextType | undefined>(undefined);

export function JSONProvider({ children }: { children: ReactNode }) {
  const [jsonData, setJsonData] = useState<JSONValue>({});
  const [initialData, setInitialData] = useState<JSONValue | null>(null);

  return (
    <JSONContext.Provider
      value={{ jsonData, setJsonData, initialData, setInitialData }}
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
