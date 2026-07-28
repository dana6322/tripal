import { Badge, Card, Divider, Group, Stack, Text, Title } from "@mantine/core";
import {
  IconClock,
  IconMapPin,
  IconBus,
  IconNote,
  IconHourglass,
} from "@tabler/icons-react";
import type { ItineraryDay } from "../types/trip";

const TIME_ORDER: Record<string, number> = {
  morning: 0,
  afternoon: 1,
  evening: 2,
  night: 3,
};

function sortByTimeOfDay(a: { timeOfDay: string }, b: { timeOfDay: string }) {
  const av = TIME_ORDER[a.timeOfDay?.toLowerCase()] ?? 99;
  const bv = TIME_ORDER[b.timeOfDay?.toLowerCase()] ?? 99;
  return av - bv;
}

export default function DayCard({ day }: { day: ItineraryDay }) {
  const activities = [...day.activities].sort(sortByTimeOfDay);

  return (
    <Card withBorder radius="md" padding="lg">
      <Group gap="sm" mb="xs">
        <Badge size="lg" variant="filled">
          Day {day.dayNumber}
        </Badge>
        <Title order={3}>{day.title}</Title>
      </Group>
      {day.summary && (
        <Text c="dimmed" mb="md">
          {day.summary}
        </Text>
      )}

      <Stack gap="md">
        {activities.map((activity, idx) => (
          <div key={idx}>
            {idx > 0 && <Divider mb="md" />}
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <div style={{ flex: 1 }}>
                <Group gap="xs" mb={4}>
                  <Badge variant="light" tt="capitalize">
                    {activity.timeOfDay}
                  </Badge>
                  {activity.category && (
                    <Badge variant="outline" color="gray" tt="capitalize">
                      {activity.category}
                    </Badge>
                  )}
                </Group>
                <Text fw={600}>{activity.title}</Text>
                <Text size="sm" c="dimmed" mb="xs">
                  {activity.description}
                </Text>

                <Stack gap={2}>
                  {activity.location && (
                    <Group gap={6}>
                      <IconMapPin size={15} />
                      <Text size="sm">{activity.location}</Text>
                    </Group>
                  )}
                  {activity.estimatedDuration && (
                    <Group gap={6}>
                      <IconHourglass size={15} />
                      <Text size="sm">{activity.estimatedDuration}</Text>
                    </Group>
                  )}
                  {activity.transportation && (
                    <Group gap={6}>
                      <IconBus size={15} />
                      <Text size="sm">{activity.transportation}</Text>
                    </Group>
                  )}
                  {activity.notes && (
                    <Group gap={6} align="flex-start">
                      <IconNote size={15} style={{ marginTop: 3 }} />
                      <Text size="sm" c="dimmed" fs="italic">
                        {activity.notes}
                      </Text>
                    </Group>
                  )}
                </Stack>
              </div>
            </Group>
          </div>
        ))}
      </Stack>

      {activities.length === 0 && (
        <Group gap={6} c="dimmed">
          <IconClock size={15} />
          <Text size="sm">No activities planned for this day.</Text>
        </Group>
      )}
    </Card>
  );
}
