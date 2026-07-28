import type { StayPreference } from "../types/trip";

export const TRANSPORTATION_OPTIONS = [
  { value: "car", label: "Car" },
  { value: "walking", label: "Walking" },
  { value: "public_transport", label: "Public transportation" },
];

export const ACTIVITY_OPTIONS = [
  { value: "museums", label: "Museums" },
  { value: "hiking", label: "Hiking" },
  { value: "food", label: "Food" },
  { value: "shopping", label: "Shopping" },
  { value: "nature", label: "Nature" },
  { value: "nightlife", label: "Nightlife" },
  { value: "history", label: "History" },
  { value: "other", label: "Other" },
];

export const STAY_PREFERENCE_OPTIONS: { value: StayPreference; label: string }[] = [
  { value: "stay_in_city", label: "Stay inside the city" },
  { value: "include_day_trips", label: "Include nearby day trips" },
  { value: "no_preference", label: "No preference" },
];

export const DEFAULT_TRIP_PROFILE = "no_profile";

export const TRIP_PROFILE_OPTIONS = [
  { value: "no_profile", label: "No profile" },
  { value: "couple", label: "Couple" },
  { value: "family", label: "Family" },
  { value: "friends", label: "Friends" },
  { value: "solo", label: "Solo" },
  { value: "bachelorette", label: "Bachelorette party" },
  { value: "other", label: "Other" },
];

export const MAX_TRAVELERS = 20;
export const MAX_DAYS = 14;
export const MAX_AGE = 120;
export const MAX_ADDITIONAL_DETAILS = 1000;
