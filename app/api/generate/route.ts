import { NextRequest } from "next/server";
import { CoreMessage, streamText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { Model } from "@/components/NavBar";
import { JSONObject } from "@/types/json";

const systemPrompt = `
You are a data generator. 
You will be given a JSON schema and a context for the application.
You will generate data that fits the schema.
`;

const generateUserPrompt = (
  schema: JSONObject,
  rowCount: number,
  context: string
) => {
  const newMessage: CoreMessage = {
    role: "user",
    content: `
  Here is the JSON schema:
  ${JSON.stringify(schema, null, 2)}

  Here is the context for the application:
  ${context}

  Generate ${rowCount} rows of data that fits the schema.

  Only return the JSON, no other text.
  Do not repeat the data.
  `,
  };
  return [newMessage];
};

const getProvider = (model: Model, apiKey: string) => {
  if (model.provider === "anthropic") {
    const anthropic = createAnthropic({ apiKey });
    return anthropic(model.value);
  }

  const openai = createOpenAI({ apiKey });
  return openai(model.value);
};

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const { schema, rowCount, context, model, apiKey } = json;
    console.log(json);

    if (!schema || !apiKey || !model) {
      throw new Error("Missing required fields");
    }

    const provider = getProvider(model, apiKey);
    const messages = generateUserPrompt(schema, rowCount || 10, context || "");
    const result = await streamText({
      model: provider,
      system: systemPrompt,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error generating data:", error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "Failed to generate data",
      }),
      { status: 500 }
    );
  }
}
