import * as yup from "yup";

const splitCommaList = (value: unknown, originalValue: unknown): unknown =>
  typeof originalValue === "string"
    ? originalValue.split(",").map((item) => item.trim()).filter(Boolean)
    : value;

export const generateTripSchema = yup.object({
  destination: yup.string().trim().required("Destination is required."),

  numberOfTravelers: yup
    .number()
    .integer()
    .min(1, "Number of travelers must be at least 1."),

  travelerAges: yup
    .array()
    // .transform(splitCommaList)
    .of(
      yup
        .number()
        .integer()
        .min(0, "Traveler ages must be at least 0.")
        .max(120, "Traveler ages must be at most 120.")
        .required()
    )
    .when("numberOfTravelers", ([numberOfTravelers], schema) =>
      typeof numberOfTravelers === "number"
        ? schema.length(
            numberOfTravelers,
            "The number of traveler ages must match the number of travelers."
          )
        : schema
    ),

  numberOfDays: yup
    .number()
    .integer()
    .min(1, "Number of days must be at least 1.")
    .max(14, "Number of days must be at most 14.")
    .required("Number of days is required."),

  transportationPreferences: yup
    .array()
    // .transform(splitCommaList)
    .of(yup.string().required())
    .min(1, "At least one transportation preference is required.")
    .required("Transportation preferences are required."),

  activityPreferences: yup
    .array()
    // .transform(splitCommaList)
    .of(yup.string().required())
    .min(1, "At least one activity preference is required."),

  stayPreference: yup
    .string()
    .oneOf(
      ["stay_in_city", "include_day_trips", "no_preference"],
      "Stay preference must be a valid option."
    ),

  tripProfile: yup.string().trim(),

  additionalDetails: yup
    .string()
    .trim()
    .max(1000, "Additional details must be at most 1,000 characters.")
    .optional(),
});

export type GenerateTripSchemaOutput = yup.InferType<typeof generateTripSchema>;
