import * as yup from "yup";

const activitySchema = yup.object({
  timeOfDay: yup
    .string()
    .oneOf(["morning", "afternoon", "evening"])
    .required(),
  title: yup.string().required(),
  description: yup.string().required(),
  location: yup.string().required(),
  estimatedDuration: yup.string().required(),
  transportation: yup.string().required(),
  category: yup.string().required(),
  notes: yup
    .string()
    .nullable()
    .optional()
    .transform((value) => (value === null ? undefined : value)),
});

const daySchema = yup.object({
  dayNumber: yup.number().integer().min(1).required(),
  title: yup.string().required(),
  summary: yup.string().required(),
  activities: yup.array().of(activitySchema).min(1).required(),
});

export const itinerarySchema = yup.object({
  destination: yup.string().required(),
  summary: yup.string().required(),
  numberOfDays: yup.number().integer().min(1).required(),
  days: yup.array().of(daySchema).min(1).required(),
  generalTips: yup.array().of(yup.string().required()).required(),
});

export type ItinerarySchemaOutput = yup.InferType<typeof itinerarySchema>;
