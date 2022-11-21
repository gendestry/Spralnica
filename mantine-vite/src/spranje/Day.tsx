import { Badge, Flex, Grid, Group } from "@mantine/core";
import { AccordionList } from "./AccordioList";

export const Day = () => {
  return (
    <Group spacing={"md"} align="flex-start" noWrap>
      <AccordionList />
      <AccordionList />
    </Group>
  );
};
