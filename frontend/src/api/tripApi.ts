import type { GenerateTripRequest, Itinerary, ApiErrorResponse } from "../types/trip";
import { buildMockItinerary } from "./mockItinerary";

// When true, always use mock data. Otherwise mock is only used as a
// fallback if the backend server cannot be reached.
const ALWAYS_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const MOCK_DELAY_MS = 600;

const ENDPOINT = "/api/trips/generate";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isErrorResponse(data: unknown): data is ApiErrorResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "success" in data &&
    (data as { success: unknown }).success === false
  );
}

export async function generateTrip(request: GenerateTripRequest): Promise<Itinerary> {
  console.log("[generateTrip] QUERY", ENDPOINT);
  console.log("[generateTrip] request body:", request);
  console.log("[generateTrip] request body (JSON):", JSON.stringify(request, null, 2));

  if (ALWAYS_MOCK) {
    await delay(MOCK_DELAY_MS);
    return buildMockItinerary(request);
  }

  let response: Response;
  try {
    response = await fetch(ENDPOINT, {
      method: "QUERY",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
  } catch {
    // Server is unreachable (not running / network error): fall back to mock data.
    await delay(MOCK_DELAY_MS);
    return buildMockItinerary(request);
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    // Non-JSON response (e.g. dev proxy 404 HTML when no backend): fall back to mock.
    await delay(MOCK_DELAY_MS);
    return buildMockItinerary(request);
  }

  if (isErrorResponse(body)) {
    // A real, structured validation/AI error from the backend should surface to the user.
    throw new Error(body.error.message);
  }

  if (!response.ok) {
    throw new Error("The itinerary could not be generated.");
  }

  return body as Itinerary;
}
