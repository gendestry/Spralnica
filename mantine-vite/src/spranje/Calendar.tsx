import { Calendar } from "@mantine/dates";
import { useState } from "react";

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
        value={date}
        onChange={setDate}
        fullWidth
        size="xl"
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
