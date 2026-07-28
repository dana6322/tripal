import type { Request, Response, NextFunction } from "express";
import type { GenerateTripSchemaOutput } from "../validation/generateTripSchema";
import { buildTripPrompt } from "../services/promptBuilder";
import { generateItinerary } from "../services/geminiService";

export const generateTrip = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedTrip = req.body as GenerateTripSchemaOutput;
    const prompt = buildTripPrompt(validatedTrip);
    const itinerary = await generateItinerary(prompt);

    res.json({ success: true, data: itinerary });
  } catch (error) {
    next(error);
  }
};
