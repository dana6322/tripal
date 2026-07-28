# AI Trip Planner — SPEC

## Overview

Build a full-stack AI trip planner using React, TypeScript, Express, Yup, and Google Gemini.

The user fills out a trip preferences form. The frontend sends the values to the backend as query parameters. The backend validates the input, builds a Gemini prompt, generates a structured itinerary, and returns JSON.

The frontend displays the itinerary on a separate results page using one card per day.

## User Inputs

The form must include:

* Destination
* Number of travelers
* Age of each traveler
* Trip dates (start date and end date, chosen from a calendar, required)
* Transportation preferences:

  * Car
  * Walking
  * Public transportation
* Activity preferences:

  * Museums
  * Hiking
  * Food
  * Shopping
  * Nature
  * Nightlife
  * History
  * Other
* Stay preference:

  * Stay inside the city
  * Include nearby day trips
  * No preference
* Trip profile:

  * Couple
  * Family
  * Friends
  * Solo
  * Bachelorette party
  * Other
* Additional free-text instructions

## Frontend Flow

1. Display the trip form.
2. Validate required fields.
3. When the user clicks **Generate Trip**, show a loading state.
4. Send a query request to:

```http
GET /api/trips/generate
```

Example:

```http
/api/trips/generate?destination=Rome&numberOfTravelers=3&travelerAges=34,32,6&startDate=2026-08-10&endDate=2026-08-13&transportationPreferences=walking,public_transport&activityPreferences=museums,food,history&stayPreference=include_day_trips&tripProfile=family&additionalDetails=One traveler is vegetarian
```

5. After receiving the itinerary, navigate to:

```text
/itinerary
```

6. Display one card for each day.

## Request Type

```typescript
interface GenerateTripRequest {
  destination: string;
  numberOfTravelers: number;
  travelerAges: number[];
  startDate: string;
  endDate: string;
  transportationPreferences: string[];
  activityPreferences: string[];
  stayPreference:
    | "stay_in_city"
    | "include_day_trips"
    | "no_preference";
  tripProfile: string;
  additionalDetails?: string;
}
```

## Backend Flow

The Express backend must:

1. Read values from `req.query`.
2. Convert numeric and comma-separated values into the correct types.
3. Validate the normalized input using Yup.
4. Build a prompt using the validated input.
5. Send the prompt to Google Gemini.
6. Request a valid JSON response.
7. Parse and validate the Gemini response.
8. Return the itinerary to the frontend.

The Gemini API key must exist only in the backend environment variables.

```env
GEMINI_API_KEY=your_api_key
GEMINI_MODEL=your_model_name
```

## Yup Validation

`generateTripSchema` fields:

* `destination: string, required`
* `numberOfTravelers: number, integer, min 1`
* `travelerAges: number[], each 0–120, length must equal numberOfTravelers`
* `startDate: date, required`
* `endDate: date, required, must be on/after startDate, span at most 14 days`
* `transportationPreferences: string[], min 1, required`
* `activityPreferences: string[], min 1`
* `stayPreference: "stay_in_city" | "include_day_trips" | "no_preference"`
* `tripProfile: string`
* `additionalDetails: string, max 1000 chars, optional`

Use:

```typescript
await generateTripSchema.validate(normalizedQuery, {
  abortEarly: false,
  stripUnknown: true
});
```

Do not call Gemini when validation fails.

## Gemini Prompt Requirements

Gemini should:

* Generate exactly the requested number of days.
* Consider traveler ages and trip profile.
* Respect transportation and activity preferences.
* Respect the city or day-trip preference.
* Consider the additional instructions.
* Group nearby attractions together.
* Create a realistic activity order.
* Avoid inventing exact prices or opening hours.
* Return valid JSON only.
* Return no Markdown or code fences.

## Response Format

```json
{
  "destination": "Rome, Italy",
  "summary": "A four-day family trip in Rome.",
  "numberOfDays": 4,
  "days": [
    {
      "dayNumber": 1,
      "title": "Historic Rome",
      "summary": "Visit central historic attractions.",
      "activities": [
        {
          "timeOfDay": "morning",
          "title": "Visit the Colosseum",
          "description": "Explore the Colosseum.",
          "location": "Colosseum",
          "estimatedDuration": "2 hours",
          "transportation": "Public transportation and walking",
          "category": "history",
          "notes": "Check opening hours and reserve in advance."
        }
      ]
    }
  ],
  "generalTips": [
    "Wear comfortable shoes.",
    "Reserve popular attractions in advance."
  ]
}
```

## Results Page

The itinerary page should display:

* Destination
* Trip summary
* One card per day
* Activities organized by morning, afternoon, and evening
* General trip tips
* A **Plan Another Trip** button

Each activity should display:

* Time of day
* Title
* Description
* Location
* Duration
* Transportation
* Optional notes

## Error Handling

Return consistent errors.

Validation error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The trip details are invalid."
  }
}
```

Gemini error:

```json
{
  "success": false,
  "error": {
    "code": "AI_GENERATION_ERROR",
    "message": "The itinerary could not be generated."
  }
}
```

## Project Requirements

* Use TypeScript on the frontend and backend.
* Use React Router.
* Use Express and Yup.
* Keep the Gemini API key on the backend.
* Do not use a database.
* Do not add authentication.
* Prevent duplicate requests while loading.
* Do not return raw Gemini text.
* Validate both the user input and Gemini response.
* Complete the main end-to-end flow before adding optional features.
