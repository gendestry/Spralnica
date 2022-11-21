import {
  Group,
  Avatar,
  Text,
  Accordion,
  Stack,
  Table,
  Flex,
  Title,
  Button,
} from "@mantine/core";
import { user } from "firebase-functions/v1/auth";
import { IUser } from "../api/listUsers";

interface AccordionLabelProps {
  hourFrom: number;
  hourTo: number;
  user?: IUser;
  machine: 1 | 2;
}

const data: AccordionLabelProps[] = [
  {
    hourFrom: 8,
    hourTo: 9,
    machine: 1,
    user: {
      uuid: "asasduqnqajsdwa",
      name: "Janez",
      surname: "novak",
      email: "janez@novak.com",
      confirmed: true,
      role: "user",
      disabled: false,
      room: 302,
      phone: "+38631366200",
    },
  },
  {
    hourFrom: 9,
    hourTo: 10,
    machine: 1,
    user: undefined,
  },
  {
    hourFrom: 10,
    hourTo: 11,
    machine: 1,
    user: {
      uuid: "sdasdawdwdasdwa",
      name: "Zan",
      surname: "Gej",
      email: "zan@gej.com",
      confirmed: true,
      role: "admin",
      disabled: false,
      room: 399,
      phone: "+38631366200",
    },
  },
  {
    hourFrom: 11,
    hourTo: 12,
    machine: 1,
    user: undefined,
  },
  {
    hourFrom: 8,
    hourTo: 9,
    machine: 1,
    user: {
      uuid: "asasduqnqajsdwa",
      name: "Janez",
      surname: "novak",
      email: "janez@novak.com",
      confirmed: true,
      role: "user",
      disabled: false,
      room: 302,
      phone: "+38631366200",
    },
  },
  {
    hourFrom: 9,
    hourTo: 10,
    machine: 1,
    user: undefined,
  },
  {
    hourFrom: 10,
    hourTo: 11,
    machine: 1,
    user: {
      uuid: "sdasdawdwdasdwa",
      name: "Zan",
      surname: "Gej",
      email: "zan@gej.com",
      confirmed: true,
      role: "admin",
      disabled: false,
      room: 399,
      phone: "+38631366200",
    },
  },
  {
    hourFrom: 11,
    hourTo: 12,
    machine: 1,
    user: undefined,
  },
];

function machineToColor(machine: 1 | 2) {
  return machine === 1 ? "teal" : "orange";
}

function usertoAvatar(user: IUser) {
  const col = user.role == "admin" ? "purple" : "blue";
  return (
    <Avatar radius="xl" size="md" color={col}>
      {user.name[0]} {user.surname[0]}
    </Avatar>
  );
}

export function AccordionLabel({
  hourFrom,
  hourTo,
  machine,
  user,
}: AccordionLabelProps) {
  return (
    <Group noWrap align="center">
      {user && usertoAvatar(user)}
      {!user && (
        <Avatar radius="xl" size="md">
          {machine}
        </Avatar>
      )}
      <div>
        <Text>{`${hourFrom} - ${hourTo}h`}</Text>
        {/* {user && <Text>{`${user.name}${user.surname}`}</Text>} */}
      </div>
    </Group>
  );
}

export function AccordionList() {
  const items = data.map((item, i) => (
    <Accordion.Item value={"item_" + i} key={item.machine}>
      <Accordion.Control>
        <AccordionLabel {...item} />
      </Accordion.Control>
      <Accordion.Panel>
        <Text size="sm">
          {item.user && (
            <Stack>
              <Title size="h4">
                {item.user.name} {item.user.surname}
              </Title>
              <Table>
                <tbody>
                  <tr>
                    <td>
                      <Text weight={800}>Tel:</Text>{" "}
                    </td>
                    <td>{item.user.phone}</td>
                  </tr>
                  <tr>
                    <td>
                      <Text weight={800}>Mail:</Text>{" "}
                    </td>
                    <td>{item.user.email}</td>
                  </tr>
                  <tr>
                    <td>
                      <Text weight={800}>Soba:</Text>{" "}
                    </td>
                    <td>{item.user.room}</td>
                  </tr>
                </tbody>
              </Table>
            </Stack>
          )}
          {!item.user && <Button variant="light"> Prijava na termin</Button>}
        </Text>
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <Accordion w="100%" chevronPosition="right" variant="contained">
      {items}
    </Accordion>
  );
}
