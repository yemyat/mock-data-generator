export type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
export interface JSONObject { [key: string]: JSONValue }
export type JSONArray = JSONValue[];

export interface JSONNode {
  key: string | null;
  value: JSONValue;
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  description: string;
}

