import { GoogleGenerativeAI, SchemaType, type Schema } from "@google/generative-ai";
import { env } from "../config/env";
import { AiGenerationError } from "../utils/errors";
import { itinerarySchema } from "../validation/itinerarySchema";
import type { TripItinerary } from "../types/trip";

const genAI = new GoogleGenerativeAI(env.geminiApiKey);

const activityResponseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    timeOfDay: {
      type: SchemaType.STRING,
      enum: ["morning", "afternoon", "evening"],
    },
    title: { type: SchemaType.STRING },
    description: { type: SchemaType.STRING },
    location: { type: SchemaType.STRING },
    estimatedDuration: { type: SchemaType.STRING },
    transportation: { type: SchemaType.STRING },
    category: { type: SchemaType.STRING },
    notes: { type: SchemaType.STRING, nullable: true },
  },
  required: [
    "timeOfDay",
    "title",
    "description",
    "location",
    "estimatedDuration",
    "transportation",
    "category",
  ],
};

const dayResponseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    dayNumber: { type: SchemaType.NUMBER },
    title: { type: SchemaType.STRING },
    summary: { type: SchemaType.STRING },
    activities: {
      type: SchemaType.ARRAY,
      items: activityResponseSchema,
    },
  },
  required: ["dayNumber", "title", "summary", "activities"],
};

const itineraryResponseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    destination: { type: SchemaType.STRING },
    summary: { type: SchemaType.STRING },
    numberOfDays: { type: SchemaType.NUMBER },
    days: {
      type: SchemaType.ARRAY,
      items: dayResponseSchema,
    },
    generalTips: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
  },
  required: ["destination", "summary", "numberOfDays", "days", "generalTips"],
};

const stripCodeFences = (text: string): string => {
  return text
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
};

export const generateItinerary = async (prompt: string): Promise<TripItinerary> => {
  const model = genAI.getGenerativeModel({
    model: env.geminiModel,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: itineraryResponseSchema,
    },
  });

  let rawText: string;
  try {
    const result = await model.generateContent(prompt);
    rawText = result.response.text();
  } catch {
    throw new AiGenerationError();
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(stripCodeFences(rawText));
  } catch {
    throw new AiGenerationError();
  }

  try {
    return await itinerarySchema.validate(parsed, {
      abortEarly: false,
      stripUnknown: true,
    });
  } catch {
    throw new AiGenerationError();
  }
};
