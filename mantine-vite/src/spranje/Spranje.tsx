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
  Alert,
  Loader,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconCalendar,
  IconMessageCircle,
  IconPhoto,
} from "@tabler/icons";
import { useState } from "react";
import { Cal } from "./Calendar";
import { Day } from "./Day";
import { IconSettings } from "@tabler/icons";
import { useGetTerminsMonthly } from "../api/getTermin";

export const Spranje = () => {
  const [activeTab, setActiveTab] = useState<string | null>("mesec");
  const [date, setDate] = useState(new Date());

  const [thisMonth, setMonth] = useState(new Date());

  const { data, error } = useGetTerminsMonthly(
    thisMonth.getMonth() + 1,
    thisMonth.getFullYear()
  );

  function dateSetterWrap(date: Date) {
    setActiveTab("dan");
    setDate(date);
  }

  console.log({ data });

  return (
    <Tabs
      value={activeTab}
      onTabChange={setActiveTab}
      h="100%"
      style={{ overflowY: "hidden", overflowX: "hidden" }}
    >
      <Stack
        w="100%"
        h="100%"
        style={{ overflowY: "hidden", overflowX: "hidden" }}
      >
        <Flex align={"center"} justify="center" my={20}>
          <Badge
            size="lg"
            px={24}
            py={12}
            mx={16}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setActiveTab("mesec");
            }}
            color={activeTab === "mesec" ? undefined : "gray"}
          >
            Mesec
          </Badge>
          <Badge
            size="lg"
            px={24}
            py={12}
            mx={16}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setActiveTab("dan");
            }}
            color={activeTab === "dan" ? undefined : "gray"}
          >
            Dan
          </Badge>
        </Flex>

        {activeTab === "mesec" && (
          <Cal
            data={data || []}
            date={date}
            setDate={dateSetterWrap}
            month={thisMonth}
            setMonth={setMonth}
          />
        )}
        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Napaka"
            color="red"
            variant="outline"
          >
            Ni možno naložiti terminov
          </Alert>
        )}
        {!data && !error && <Loader />}
        {data && activeTab === "dan" && (
          <Day date={date} data={data[date.getDate() - 1]} />
        )}
        {/* </Box> */}
      </Stack>
    </Tabs>
  );
};
