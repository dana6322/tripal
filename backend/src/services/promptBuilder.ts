import type { GenerateTripSchemaOutput } from "../validation/generateTripSchema";

const DEFAULT_NUMBER_OF_TRAVELERS = 1;
const DEFAULT_TRAVELER_AGE = 29; // average of the 28-30 range
const DEFAULT_TRANSPORTATION_PREFERENCES = ["walking", "public_transport"];
const DEFAULT_ACTIVITY_PREFERENCES = ["sightseeing"];
const DEFAULT_STAY_PREFERENCE = "no_preference";
const DEFAULT_TRIP_PROFILE = "solo";
const DEFAULT_TRIP_LENGTH_DAYS = 3;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const stayPreferenceText: Record<string, string> = {
  stay_in_city: "Stay inside the city only.",
  include_day_trips: "Include nearby day trips where relevant.",
  no_preference: "No preference between staying in the city or taking day trips.",
};

const toISODate = (date: Date): string => date.toISOString().slice(0, 10);

const getDefaultDateRange = (): { startDate: Date; endDate: Date } => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 1);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + DEFAULT_TRIP_LENGTH_DAYS - 1);
  return { startDate, endDate };
};

const countTripDays = (startDate: Date, endDate: Date): number =>
  Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / MS_PER_DAY) + 1);

export const buildTripPrompt = (input: GenerateTripSchemaOutput): string => {
  const destination = input.destination;

  const { startDate, endDate } =
    input.startDate && input.endDate
      ? { startDate: input.startDate, endDate: input.endDate }
      : getDefaultDateRange();

  const numberOfDays = countTripDays(startDate, endDate);

  const transportationPreferences =
    input.transportationPreferences && input.transportationPreferences.length > 0
      ? input.transportationPreferences
      : DEFAULT_TRANSPORTATION_PREFERENCES;

  const activityPreferences =
    input.activityPreferences && input.activityPreferences.length > 0
      ? input.activityPreferences
      : DEFAULT_ACTIVITY_PREFERENCES;

  const stayPreference = input.stayPreference ?? DEFAULT_STAY_PREFERENCE;
  const tripProfile = input.tripProfile || DEFAULT_TRIP_PROFILE;

  const additionalDetails =
    input.additionalDetails && input.additionalDetails.length > 0
      ? input.additionalDetails
      : "None";

  const numberOfTravelers =
    input.numberOfTravelers ?? input.travelerAges?.length ?? DEFAULT_NUMBER_OF_TRAVELERS;

  const travelerAges =
    input.travelerAges && input.travelerAges.length > 0
      ? input.travelerAges
      : Array.from({ length: numberOfTravelers }, () => DEFAULT_TRAVELER_AGE);

  return `You are an expert travel planner. Create a detailed, realistic day-by-day itinerary.

Trip details:
- Destination: ${destination}
- Number of travelers: ${numberOfTravelers}
- Traveler ages: ${travelerAges.join(", ")}
- Travel dates: ${toISODate(startDate)} to ${toISODate(endDate)}
- Number of days: ${numberOfDays}
- Trip profile: ${tripProfile}
- Transportation preferences: ${transportationPreferences.join(", ")}
- Activity preferences: ${activityPreferences.join(", ")}
- Stay preference: ${stayPreferenceText[stayPreference] ?? stayPreference}
- Additional instructions: ${additionalDetails}

Requirements:
- Generate exactly ${numberOfDays} day(s), numbered sequentially starting at 1.
- Consider the travelers' ages and the trip profile when choosing activities and pacing.
- Respect the transportation and activity preferences.
- Respect the stay preference.
- Take the additional instructions into account.
- Group nearby attractions together within the same day.
- Order activities in a realistic sequence (morning, afternoon, evening).
- Do not invent exact prices or opening hours; use general guidance instead (e.g. "check opening hours in advance").
- Respond with valid JSON only. Do not include Markdown, code fences, or any explanatory text outside the JSON.

Return JSON that strictly matches this shape:
{
  "destination": string,
  "summary": string,
  "numberOfDays": number,
  "days": [
    {
      "dayNumber": number,
      "title": string,
      "summary": string,
      "activities": [
        {
          "timeOfDay": "morning" | "afternoon" | "evening",
          "title": string,
          "description": string,
          "location": string,
          "estimatedDuration": string,
          "transportation": string,
          "category": string,
          "notes"?: string
        }
      ]
    }
  ],
  "generalTips": string[]
}`;
};
