import dotenv from "dotenv";

dotenv.config();

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const env = {
  port: Number(process.env.PORT ?? 4000),
  geminiApiKey: requireEnv("GEMINI_API_KEY"),
  geminiModel: requireEnv("GEMINI_MODEL")
};
