import {
  Stack,
  Flex,
  Text,
  Button,
  Group,
  Container,
  Center,
} from "@mantine/core";
import "./rotate.css";

export const Home = () => {
  return (
    <Container w="100%" h="100%">
      <Center w="100%" h="100%">
        <Stack w="100%" align="center" gap="xl">
          <Flex align="center" justify="center">
            <Text
              className="rotate big"
              variant="gradient"
              gradient={{ from: "red", to: "grape", deg: 90 }}
              ta="center"
              fw={700}
              size="5rem"
            >
              S
            </Text>
            <Text
              className=" big"
              variant="gradient"
              gradient={{ from: "cyan", to: "royalblue", deg: 45 }}
              ta="center"
              fw={700}
              size="5rem"
            >
              pral
            </Text>
            <Text
              className="rotate big"
              variant="gradient"
              gradient={{ from: "yellow", to: "forestgreen", deg: 45 }}
              ta="center"
              fw={700}
              size="5rem"
            >
              n
            </Text>
            <Text
              className=" big"
              variant="gradient"
              gradient={{ from: "cyan", to: "royalblue", deg: 45 }}
              ta="center"
              size="5rem"
              fw={700}
            >
              ica
            </Text>
          </Flex>
          <Text>Gerbičeva 59, 1000 Ljubljana, Slovenija</Text>
          <Group gap={"md"}>
            <Button>Pranje</Button>
            <Button>Pravila</Button>
          </Group>
        </Stack>
      </Center>
    </Container>
  );
};
