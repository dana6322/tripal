export type StayPreference =
  | "stay_in_city"
  | "include_day_trips"
  | "no_preference";

export interface GenerateTripRequest {
  destination: string;
  numberOfTravelers: number;
  travelerAges: number[];
  numberOfDays: number;
  transportationPreferences: string[];
  activityPreferences: string[];
  stayPreference: StayPreference;
  tripProfile: string;
  additionalDetails?: string;
}

export interface Activity {
  timeOfDay: string;
  title: string;
  description: string;
  location: string;
  estimatedDuration: string;
  transportation: string;
  category: string;
  notes?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  summary: string;
  activities: Activity[];
}

export interface Itinerary {
  destination: string;
  summary: string;
  numberOfDays: number;
  days: ItineraryDay[];
  generalTips: string[];
}

export interface ApiError {
  code: string;
  message: string;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
