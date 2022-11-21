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
  Avatar,
  ActionIcon,
} from "@mantine/core";
import { IconCalendar, IconMessageCircle, IconPhoto } from "@tabler/icons";
import { useState } from "react";
import { Cal } from "./Calendar";
import { Day } from "./Day";
import { IconSettings } from "@tabler/icons";

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
        </Flex>

        <Tabs.Panel value="first">
          <Cal date={date} setDate={dateSetterWrap} />
        </Tabs.Panel>

        <Tabs.Panel value="second">
          <Center mb={24}>
            <Text size={24}>
              <Badge
                size="lg"
                mx={16}
                style={{ cursor: "pointer" }}
                color={activeTab === "second" ? "blue" : "gray"}
                onClick={() => {
                  setActiveTab("second");
                }}
                leftSection={
                  <ActionIcon variant="transparent" disabled>
                    <IconCalendar size={"1rem"} />
                  </ActionIcon>
                }
              >
                {date.toLocaleDateString()}
              </Badge>
            </Text>
          </Center>
          <Day></Day>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};
