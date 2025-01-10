export type JSONValue = string | number | boolean | null;

export interface JSONNode {
  key: string;
  value: JSONValue;
  type: "string" | "number" | "boolean" | "null";
  description: string;
}

export interface JSONObject {
  [key: string]: JSONValue;
}
