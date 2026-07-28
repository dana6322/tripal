export type StayPreference = "stay_in_city" | "include_day_trips" | "no_preference";

export interface GenerateTripRequest {
  destination: string;
  numberOfTravelers: number;
  travelerAges: number[];
  startDate: string;
  endDate: string;
  transportationPreferences: string[];
  activityPreferences: string[];
  stayPreference: StayPreference;
  tripProfile: string;
  additionalDetails?: string;
}

export type TimeOfDay = "morning" | "afternoon" | "evening";

export interface TripActivity {
  timeOfDay: TimeOfDay;
  title: string;
  description: string;
  location: string;
  estimatedDuration: string;
  transportation: string;
  category: string;
  notes?: string;
}

export interface TripDay {
  dayNumber: number;
  title: string;
  summary: string;
  activities: TripActivity[];
}

export interface TripItinerary {
  destination: string;
  summary: string;
  numberOfDays: number;
  days: TripDay[];
  generalTips: string[];
}
