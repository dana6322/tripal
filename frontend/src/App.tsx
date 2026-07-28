import { AppShell, Container, Group, Text, Title } from "@mantine/core";
import { IconPlane } from "@tabler/icons-react";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <AppShell header={{ height: 64 }} padding="md">
      <AppShell.Header>
        <Container size="lg" h="100%">
          <Group h="100%" gap="xs">
            <IconPlane size={26} />
            <Title order={3}>Tripal</Title>
            <Text c="dimmed" size="sm" ml="xs">
              AI Trip Planner
            </Text>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg">
          <HomePage />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
