import type { GenerateTripRequest, Itinerary, ItineraryDay } from "../types/trip";

const DAY_TEMPLATES: Omit<ItineraryDay, "dayNumber">[] = [
  {
    title: "Historic Highlights",
    summary: "Explore the central historic attractions at a relaxed pace.",
    activities: [
      {
        timeOfDay: "morning",
        title: "Old Town walking tour",
        description: "Wander the historic center and main landmarks on foot.",
        location: "Old Town",
        estimatedDuration: "2 hours",
        transportation: "Walking",
        category: "history",
        notes: "Start early to avoid crowds.",
      },
      {
        timeOfDay: "afternoon",
        title: "Local museum visit",
        description: "Visit a well-known museum to learn about the local culture.",
        location: "City Museum",
        estimatedDuration: "1.5 hours",
        transportation: "Public transportation",
        category: "museums",
      },
      {
        timeOfDay: "evening",
        title: "Dinner at a local favorite",
        description: "Enjoy regional specialties at a popular restaurant.",
        location: "City center",
        estimatedDuration: "1.5 hours",
        transportation: "Walking",
        category: "food",
        notes: "Reserve a table in advance.",
      },
    ],
  },
  {
    title: "Nature & Views",
    summary: "A day spent outdoors enjoying scenery and fresh air.",
    activities: [
      {
        timeOfDay: "morning",
        title: "Scenic viewpoint hike",
        description: "A moderate hike leading to panoramic city views.",
        location: "Hilltop viewpoint",
        estimatedDuration: "3 hours",
        transportation: "Public transportation and walking",
        category: "nature",
        notes: "Bring water and comfortable shoes.",
      },
      {
        timeOfDay: "afternoon",
        title: "Park picnic & stroll",
        description: "Relax in a large city park with a casual lunch.",
        location: "Central Park",
        estimatedDuration: "2 hours",
        transportation: "Walking",
        category: "nature",
      },
      {
        timeOfDay: "evening",
        title: "Riverside walk",
        description: "An easy evening walk along the waterfront.",
        location: "Riverfront promenade",
        estimatedDuration: "1 hour",
        transportation: "Walking",
        category: "nature",
      },
    ],
  },
  {
    title: "Markets & Local Life",
    summary: "Discover local markets, shops, and neighborhood spots.",
    activities: [
      {
        timeOfDay: "morning",
        title: "Central market visit",
        description: "Browse fresh produce and local goods at the market.",
        location: "Central Market",
        estimatedDuration: "1.5 hours",
        transportation: "Public transportation",
        category: "food",
      },
      {
        timeOfDay: "afternoon",
        title: "Shopping district",
        description: "Explore boutiques and local shops.",
        location: "Shopping district",
        estimatedDuration: "2 hours",
        transportation: "Walking",
        category: "shopping",
      },
      {
        timeOfDay: "evening",
        title: "Nightlife spot",
        description: "Wind down at a lively bar or live-music venue.",
        location: "Entertainment quarter",
        estimatedDuration: "2 hours",
        transportation: "Walking",
        category: "nightlife",
        notes: "Check age requirements for venues.",
      },
    ],
  },
];

export function buildMockItinerary(request: GenerateTripRequest): Itinerary {
  const numberOfDays = Math.max(1, request.numberOfDays);
  const days: ItineraryDay[] = Array.from({ length: numberOfDays }, (_, i) => {
    const template = DAY_TEMPLATES[i % DAY_TEMPLATES.length];
    return { dayNumber: i + 1, ...template };
  });

  return {
    destination: request.destination || "Sample Destination",
    summary: `A ${numberOfDays}-day ${request.tripProfile} trip to ${
      request.destination || "your destination"
    }. (Mock data — backend not connected.)`,
    numberOfDays,
    days,
    generalTips: [
      "Wear comfortable shoes.",
      "Reserve popular attractions in advance.",
      "Carry a refillable water bottle.",
      "This is sample data shown because the server is not available.",
    ],
  };
}
