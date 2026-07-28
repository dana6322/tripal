export type ErrorCode = "VALIDATION_ERROR" | "AI_GENERATION_ERROR";

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;

  constructor(code: ErrorCode, message: string, statusCode: number) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class ValidationError extends AppError {
  constructor(message = "The trip details are invalid.") {
    super("VALIDATION_ERROR", message, 400);
  }
}

export class AiGenerationError extends AppError {
  constructor(message = "The itinerary could not be generated.") {
    super("AI_GENERATION_ERROR", message, 502);
  }
}
