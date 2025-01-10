"use server";

import { Model } from "@/components/NavBar";
import { JSONValue } from "@/types/json";
import { cosineSimilarity, generateText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";

const systemPrompt = `
You are a data generator. 
You will be given a JSON schema and a context for the application.
You will generate data that fits the schema.
`;

const generateUserPrompt = (schema: JSONValue, context: string) => {
  return `
  Here is the JSON schema:
  ${JSON.stringify(schema, null, 2)}

  Here is the context for the application:
  ${context}

  Only return the JSON, no other text.
  `;
};

const getProvider = (model: Model, apiKey: string) => {
  if (model.provider === "anthropic") {
    const anthropic = createAnthropic({ apiKey });
    return anthropic(model.value);
  }

  const openai = createOpenAI({ apiKey });
  return openai(model.value);
};

export async function generateData(
  schema: JSONValue,
  context: string,
  model: Model,
  apiKey: string
) {
  try {
    const provider = getProvider(model, apiKey);

    const result = await generateText({
      model: provider,
      system: systemPrompt,
      prompt: generateUserPrompt(schema, context),
    });

    // For now, returning a mock response
    return {
      success: true,
      result: result.text,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate data",
    };
  }
}
