import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  Group,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconAlertCircle, IconSparkles } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { generateTripThunk } from "../store/tripSlice";
import type { GenerateTripRequest, StayPreference } from "../types/trip";
import {
  ACTIVITY_OPTIONS,
  DEFAULT_TRIP_PROFILE,
  MAX_ADDITIONAL_DETAILS,
  MAX_AGE,
  MAX_DAYS,
  MAX_TRAVELERS,
  STAY_PREFERENCE_OPTIONS,
  TRANSPORTATION_OPTIONS,
  TRIP_PROFILE_OPTIONS,
} from "../constants/tripOptions";

type FormErrors = Partial<Record<string, string>>;

interface TripFiltersProps {
  onSubmitted?: () => void;
}

export default function TripFilters({ onSubmitted }: TripFiltersProps) {
  const dispatch = useAppDispatch();
  const status = useAppSelector((s) => s.trip.status);
  const apiError = useAppSelector((s) => s.trip.error);
  const savedRequest = useAppSelector((s) => s.trip.request);

  const [destination, setDestination] = useState(savedRequest?.destination ?? "");
  const [numberOfTravelers, setNumberOfTravelers] = useState<number>(
    savedRequest?.numberOfTravelers ?? 2
  );
  const [travelerAges, setTravelerAges] = useState<number[]>(
    savedRequest?.travelerAges ?? [30, 30]
  );
  const [numberOfDays, setNumberOfDays] = useState<number>(savedRequest?.numberOfDays ?? 3);
  const [transportationPreferences, setTransportationPreferences] = useState<string[]>(
    savedRequest?.transportationPreferences ?? []
  );
  const [activityPreferences, setActivityPreferences] = useState<string[]>(
    savedRequest?.activityPreferences ?? []
  );
  const [stayPreference, setStayPreference] = useState<StayPreference>(
    savedRequest?.stayPreference ?? "no_preference"
  );
  const [tripProfile, setTripProfile] = useState<string>(
    savedRequest?.tripProfile ?? DEFAULT_TRIP_PROFILE
  );
  const [additionalDetails, setAdditionalDetails] = useState(
    savedRequest?.additionalDetails ?? ""
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const isLoading = status === "loading";

  // Keep the traveler ages array length in sync with the number of travelers.
  useEffect(() => {
    setTravelerAges((prev) => {
      const next = [...prev];
      if (numberOfTravelers > prev.length) {
        while (next.length < numberOfTravelers) next.push(30);
      } else if (numberOfTravelers < prev.length) {
        next.length = numberOfTravelers;
      }
      return next;
    });
  }, [numberOfTravelers]);

  const request = useMemo<GenerateTripRequest>(
    () => ({
      destination: destination.trim(),
      numberOfTravelers,
      travelerAges,
      numberOfDays,
      transportationPreferences,
      activityPreferences,
      stayPreference,
      tripProfile,
      additionalDetails: additionalDetails.trim() || undefined,
    }),
    [
      destination,
      numberOfTravelers,
      travelerAges,
      numberOfDays,
      transportationPreferences,
      activityPreferences,
      stayPreference,
      tripProfile,
      additionalDetails,
    ]
  );

  function validate(): boolean {
    const next: FormErrors = {};
    if (!request.destination) next.destination = "Destination is required.";
    if (numberOfTravelers < 1 || numberOfTravelers > MAX_TRAVELERS) {
      next.numberOfTravelers = `Travelers must be between 1 and ${MAX_TRAVELERS}.`;
    }
    if (numberOfDays < 1 || numberOfDays > MAX_DAYS) {
      next.numberOfDays = `Days must be between 1 and ${MAX_DAYS}.`;
    }
    if (travelerAges.some((age) => age < 0 || age > MAX_AGE || Number.isNaN(age))) {
      next.travelerAges = `Each age must be between 0 and ${MAX_AGE}.`;
    }
    if (transportationPreferences.length === 0) {
      next.transportationPreferences = "Select at least one transportation option.";
    }
    if (activityPreferences.length === 0) {
      next.activityPreferences = "Select at least one activity.";
    }
    if (additionalDetails.length > MAX_ADDITIONAL_DETAILS) {
      next.additionalDetails = `Limited to ${MAX_ADDITIONAL_DETAILS} characters.`;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLoading) return; // prevent duplicate requests
    if (!validate()) return;

    const result = await dispatch(generateTripThunk(request));
    if (generateTripThunk.fulfilled.match(result)) {
      onSubmitted?.();
    }
  }

  function updateAge(index: number, value: number) {
    setTravelerAges((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        {apiError && status === "failed" && (
          <Alert icon={<IconAlertCircle size={18} />} color="red" title="Could not generate itinerary">
            {apiError}
          </Alert>
        )}

        <TextInput
          label="Destination"
          placeholder="e.g. Rome, Italy"
          required
          value={destination}
          onChange={(e) => setDestination(e.currentTarget.value)}
          error={errors.destination}
        />

        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <NumberInput
            label="Number of travelers"
            withAsterisk
            min={1}
            max={MAX_TRAVELERS}
            value={numberOfTravelers}
            onChange={(v) => setNumberOfTravelers(Number(v) || 1)}
            error={errors.numberOfTravelers}
          />
          <NumberInput
            label="Number of days"
            withAsterisk
            min={1}
            max={MAX_DAYS}
            value={numberOfDays}
            onChange={(v) => setNumberOfDays(Number(v) || 1)}
            error={errors.numberOfDays}
          />
        </SimpleGrid>

        <div>
          <Text size="sm" fw={500} mb={4}>
            Age of each traveler{" "}
            <Text component="span" c="red">
              *
            </Text>
          </Text>
          <SimpleGrid cols={{ base: 3, sm: 5 }}>
            {travelerAges.map((age, i) => (
              <NumberInput
                key={i}
                aria-label={`Traveler ${i + 1} age`}
                placeholder={`#${i + 1}`}
                min={0}
                max={MAX_AGE}
                value={age}
                onChange={(v) => updateAge(i, Number(v))}
              />
            ))}
          </SimpleGrid>
          {errors.travelerAges && (
            <Text size="xs" c="red" mt={4}>
              {errors.travelerAges}
            </Text>
          )}
        </div>

        <Checkbox.Group
          label="Transportation preferences"
          withAsterisk
          value={transportationPreferences}
          onChange={setTransportationPreferences}
          error={errors.transportationPreferences}
        >
          <Group mt="xs">
            {TRANSPORTATION_OPTIONS.map((o) => (
              <Checkbox key={o.value} value={o.value} label={o.label} />
            ))}
          </Group>
        </Checkbox.Group>

        <Checkbox.Group
          label="Activity preferences"
          withAsterisk
          value={activityPreferences}
          onChange={setActivityPreferences}
          error={errors.activityPreferences}
        >
          <SimpleGrid cols={{ base: 2, sm: 4 }} mt="xs">
            {ACTIVITY_OPTIONS.map((o) => (
              <Checkbox key={o.value} value={o.value} label={o.label} />
            ))}
          </SimpleGrid>
          <Text size="xs" c="dimmed" mt="xs">
            * If you have Other preferences, add them to additional details
          </Text>
        </Checkbox.Group>

        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Select
            label="Stay preference"
            data={STAY_PREFERENCE_OPTIONS}
            value={stayPreference}
            onChange={(v) => setStayPreference((v as StayPreference) ?? "no_preference")}
            allowDeselect={false}
          />
          <Select
            label="Trip profile"
            data={TRIP_PROFILE_OPTIONS}
            value={tripProfile}
            onChange={(v) => setTripProfile(v ?? DEFAULT_TRIP_PROFILE)}
            allowDeselect={false}
          />
        </SimpleGrid>

        <Textarea
          label="Additional details"
          placeholder="Anything else we should know? e.g. One traveler is vegetarian."
          autosize
          minRows={2}
          value={additionalDetails}
          onChange={(e) => setAdditionalDetails(e.currentTarget.value)}
          error={errors.additionalDetails}
          description={`${additionalDetails.length}/${MAX_ADDITIONAL_DETAILS}`}
        />

        <Group justify="flex-end">
          <Button
            type="submit"
            size="md"
            loading={isLoading}
            leftSection={<IconSparkles size={18} />}
          >
            Generate Trip
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
