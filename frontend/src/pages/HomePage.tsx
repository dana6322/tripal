import { useEffect, useRef } from "react";
import {
  Button,
  Card,
  Center,
  Collapse,
  Group,
  List,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Carousel } from "@mantine/carousel";
import {
  IconAdjustments,
  IconBulb,
  IconChevronDown,
  IconChevronUp,
  IconCircleCheck,
} from "@tabler/icons-react";
import { useAppSelector } from "../store/hooks";
import TripFilters from "../components/TripFilters";
import DayCard from "../components/DayCard";

export default function HomePage() {
  const itinerary = useAppSelector((s) => s.trip.itinerary);

  const [filtersOpen, filters] = useDisclosure(true);
  const hasItinerary = Boolean(itinerary);

  // Collapse the filters only when a *new* itinerary arrives, so manually
  // reopening the panel to edit the trip is not immediately undone.
  const prevItineraryRef = useRef(itinerary);
  useEffect(() => {
    if (itinerary && itinerary !== prevItineraryRef.current) {
      filters.close();
    }
    prevItineraryRef.current = itinerary;
    // `filters` is intentionally omitted: its handlers identity changes each
    // render and would otherwise re-run this effect and re-close the panel.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itinerary]);

  // Empty state: filters centered in the middle of the screen.
  if (!hasItinerary) {
    return (
      <Center mih="calc(100vh - 64px - 32px)">
        <Stack gap="lg" w="100%" maw={720}>
          <div style={{ textAlign: "center" }}>
            <Title order={1}>Plan your trip</Title>
            <Text c="dimmed">
              Tell us about your trip and we'll build a day-by-day itinerary.
            </Text>
          </div>
          <Card withBorder radius="md" padding="lg" shadow="sm">
            <TripFilters />
          </Card>
        </Stack>
      </Center>
    );
  }

  return (
    <Stack gap="lg" py="md">
      {/* Minimized filters bar, re-openable to edit and resend. */}
      <Card withBorder radius="md" padding="md" shadow="sm">
        <Group justify="space-between" wrap="nowrap">
          <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
            <ThemeIcon variant="light" size="lg">
              <IconAdjustments size={18} />
            </ThemeIcon>
            <div style={{ minWidth: 0 }}>
              <Text fw={600} truncate>
                {itinerary!.destination}
              </Text>
              <Text size="sm" c="dimmed">
                {itinerary!.numberOfDays} day{itinerary!.numberOfDays > 1 ? "s" : ""}
              </Text>
            </div>
          </Group>
          <Button
            variant="light"
            onClick={filters.toggle}
            rightSection={
              filtersOpen ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />
            }
          >
            {filtersOpen ? "Hide filters" : "Edit trip"}
          </Button>
        </Group>

        <Collapse in={filtersOpen}>
          <div style={{ paddingTop: 16 }}>
            <TripFilters onSubmitted={filters.close} />
          </div>
        </Collapse>
      </Card>

      {/* Itinerary summary */}
      <div>
        <Title order={2}>{itinerary!.destination}</Title>
        <Text c="dimmed">{itinerary!.summary}</Text>
      </div>

      {/* One card per day in a carousel */}
      <Carousel
        slideSize={{ base: "100%", sm: "60%", md: "45%" }}
        slideGap="md"
        align="start"
        withIndicators
        containScroll="trimSnaps"
      >
        {itinerary!.days.map((day) => (
          <Carousel.Slide key={day.dayNumber}>
            <DayCard day={day} />
          </Carousel.Slide>
        ))}
      </Carousel>

      {itinerary!.generalTips?.length > 0 && (
        <Card withBorder radius="md" padding="lg">
          <Group gap="xs" mb="sm">
            <ThemeIcon variant="light" color="yellow">
              <IconBulb size={18} />
            </ThemeIcon>
            <Title order={3}>General tips</Title>
          </Group>
          <List
            spacing="xs"
            icon={
              <ThemeIcon color="teal" size={20} radius="xl">
                <IconCircleCheck size={14} />
              </ThemeIcon>
            }
          >
            {itinerary!.generalTips.map((tip, i) => (
              <List.Item key={i}>{tip}</List.Item>
            ))}
          </List>
        </Card>
      )}
    </Stack>
  );
}
