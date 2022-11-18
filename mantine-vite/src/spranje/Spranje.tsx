import {
  Badge,
  Box,
  Center,
  Flex,
  Group,
  Stack,
  Tabs,
  Title,
  Text,
} from "@mantine/core";
import { IconMessageCircle, IconPhoto } from "@tabler/icons";
import { useState } from "react";
import { Cal } from "./Calendar";
import { Day } from "./Day";

export const Spranje = () => {
  const [activeTab, setActiveTab] = useState<string | null>("first");
  const [date, setDate] = useState(new Date());

  function dateSetterWrap(date: Date) {
    setActiveTab("second");
    setDate(date);
  }

  return (
    <Stack w="100%">
      <Tabs value={activeTab} onTabChange={setActiveTab}>
        <Flex align={"center"} justify="center" my={20}>
          <Badge
            size="lg"
            px={24}
            py={12}
            mx={16}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setActiveTab("first");
            }}
            color={activeTab === "first" ? "blue" : "gray"}
          >
            Mesec
          </Badge>
          <Badge
            size="lg"
            px={24}
            py={12}
            mx={16}
            style={{ cursor: "pointer" }}
            color={activeTab === "second" ? "blue" : "gray"}
            onClick={() => {
              setActiveTab("second");
            }}
          >
            Dan
          </Badge>
        </Flex>
        <Tabs.Panel value="first">
          <Cal date={date} setDate={dateSetterWrap} />
        </Tabs.Panel>
        <Tabs.Panel value="second">
          <Center mb={24}>
            <Text size={24}>
              <strong>Dan: </strong> {date.toLocaleDateString()}
            </Text>
          </Center>
          <Day></Day>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};
