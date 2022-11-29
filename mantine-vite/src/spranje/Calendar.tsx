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
  Notification,
} from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { useState } from "react";
import { useGetTerminsMonthly } from "../api/getTermin";
import "dayjs/locale/sl";

interface ICalProps {
  date: Date;
  setDate: (date: Date) => void;
}

export function Cal({ date, setDate }: ICalProps) {
  const today = new Date();
  const maxDate = new Date();
  maxDate.setMonth(today.getMonth() + 1);

  const [thisMonth, setMonth] = useState(today);
  const { data, error } = useGetTerminsMonthly(
    thisMonth.getMonth() + 1,
    thisMonth.getFullYear()
  );

  return (
    <>
      <Calendar
        // value={date}
        locale="sl"
        lang="sl"
        weekdayLabelFormat="ddd"
        firstDayOfWeek="monday"
        month={thisMonth}
        onMonthChange={setMonth}
        onChange={setDate}
        fullWidth
        size="xl"
        renderDay={(date) => {
          const day = date.getDate();
          const month = date.getMonth();
          const isPast = date < today;
          return (
            <Flex
              align="center"
              justify="center"
              opacity={isPast ? "0.8" : "1"}
            >
              {!isPast && data && month == thisMonth.getMonth() ? (
                <RingProgress
                  m={0}
                  p={0}
                  size={52}
                  thickness={5}
                  roundCaps
                  label={day}
                  sections={[
                    {
                      value:
                        ((data[day - 1] || []).filter((t) => t.washer == 0)
                          .length /
                          8) *
                        50,
                      color: "cyan",
                    },
                    {
                      value:
                        ((data[day - 1] || []).filter((t) => t.washer == 1)
                          .length /
                          8) *
                        50,
                      color: "orange",
                    },
                  ].filter((s) => s.value > 0)}
                />
              ) : (
                <Box>{day}</Box>
              )}
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
      {/* <Notification
        loading={!data && !error}
        title="Uploading data to the server"
        disallowClose
      >
        Please wait until data is uploaded, you cannot close this notification
        yet
      </Notification> */}
    </>
  );
}
