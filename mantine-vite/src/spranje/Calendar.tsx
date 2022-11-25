import {
  Box,
  Group,
  Text,
  Indicator,
  Stack,
  Flex,
  Badge,
  Avatar,
  RingProgress,
} from "@mantine/core";
import { Calendar } from "@mantine/dates";

interface ICalProps {
  date: Date;
  setDate: (date: Date) => void;
}

export function Cal({ date, setDate }: ICalProps) {
  const today = new Date();
  const maxDate = new Date();
  maxDate.setMonth(today.getMonth() + 1);

  return (
    <>
      <Calendar
        // value={date}
        onChange={setDate}
        fullWidth
        size="xl"
        renderDay={(date) => {
          const day = date.getDate();
          const isPast = date < today;
          return (
            <Flex
              align="center"
              justify="center"
              opacity={isPast ? "0.2" : "1"}
            >
              <RingProgress
                size={80}
                thickness={6}
                roundCaps
                label={day}
                sections={[
                  { value: Math.random() * 40, color: "cyan" },
                  { value: Math.random() * 40, color: "green" },
                ]}
              />
              {/* display of free spaces */}
              {/* <Flex align="center" direction="column">
                <Avatar color="blue" size="sm">
                  <Text opacity={0.5} size={"sm"}>
                    {Math.floor(Math.random() * 8)}
                  </Text>
                </Avatar>
                <Avatar color="orange" size="sm">
                  <Text opacity={0.5} size={"sm"}>
                    {Math.floor(Math.random() * 8)}
                  </Text>
                </Avatar>
              </Flex> */}

              {/* current day display
              {date.toDateString() === today.toDateString() ? (
                <Avatar>{day}</Avatar>
              ) : (
                <Box>{day}</Box>
              )} */}
            </Flex>
          );
        }}
        minDate={today}
        maxDate={maxDate}
        styles={(theme) => ({
          cell: {
            border: `1px solid ${
              theme.colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[2]
            }`,
          },
          day: {
            borderRadius: 0,
            // height: "100px",
            fontSize: theme.fontSizes.lg,
          },
          weekday: { fontSize: theme.fontSizes.lg },
          weekdayCell: {
            fontSize: theme.fontSizes.xl,
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[5]
                : theme.colors.gray[0],
            border: `1px solid ${
              theme.colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[2]
            }`,
            height: 100,
          },
        })}
      />
    </>
  );
}
