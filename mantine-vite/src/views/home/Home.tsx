import { Title, Stack, Box, Flex, Text, Button, Group } from "@mantine/core";
import "./rotate.css";

export const Home = () => {
  return (
    <Stack w="100">
      {/* <Title size={"6rem"}> */}
      <Flex align={"center"} justify="center">
        <Text
          className="rotate big"
          variant="gradient"
          gradient={{ from: "red", to: "grape", deg: 90 }}
          sx={{ fontFamily: "Greycliff CF, sans-serif" }}
          ta="center"
          fz="xl"
          fw={700}
        >
          S
        </Text>
        <Text
          className=" big"
          variant="gradient"
          gradient={{ from: "cyan", to: "royalblue", deg: 45 }}
          sx={{ fontFamily: "Greycliff CF, sans-serif" }}
          ta="center"
          fz="xl"
          fw={700}
        >
          pral
        </Text>
        <Text
          className="rotate big"
          variant="gradient"
          gradient={{ from: "yellow", to: "forestgreen", deg: 45 }}
          sx={{ fontFamily: "Greycliff CF, sans-serif" }}
          ta="center"
          fz="xl"
          fw={700}
        >
          n
        </Text>
        <Text
          className=" big"
          variant="gradient"
          gradient={{ from: "cyan", to: "royalblue", deg: 45 }}
          sx={{ fontFamily: "Greycliff CF, sans-serif" }}
          ta="center"
          fz="xl"
          fw={700}
        >
          ica
        </Text>
      </Flex>
      <Text>Gerbičeva 59, 1000 Ljubljana, Slovenija</Text>
      <Group spacing={"md"}>
        <Button>Pranje</Button>
        <Button>Pravila</Button>
      </Group>
      {/* </Title> */}
    </Stack>
  );
};
