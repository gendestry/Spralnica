import { Group, Badge, Checkbox, Text, Button, Box } from "@mantine/core";
import { IUser } from "./listUsers";

interface IUserRowProps {
  item: IUser;
  i: number;
}

export const UserRow = ({ item, i }: IUserRowProps) => {
  if (!item.name) {
    return (
      <tr key={item.uuid}>
        <td>
          <Text size="sm" color="dimmed">
            {i + 1}
          </Text>
        </td>
        <td>
          <Group spacing="sm">
            <div>
              <Text size="sm" weight={500}>
                {item.name} {item.surname}
              </Text>
              <Text size="xs" color="dimmed">
                {item.email}
              </Text>
            </div>
          </Group>
        </td>

        <td colSpan={3}>
          <Text>
            <Badge color={"orange"}>Napaka</Badge>
          </Text>
        </td>
      </tr>
    );
  }

  if (!item.confirmed) {
    return (
      <tr key={item.uuid}>
        <td>
          <Text size="sm" color="dimmed">
            {i + 1}
          </Text>
        </td>
        <td>
          <Group spacing="sm">
            <div>
              <Text size="sm" weight={500}>
                {item.name} {item.surname}
              </Text>
              <Text size="xs" color="dimmed">
                {item.email}
              </Text>
            </div>
          </Group>
        </td>

        <td>
          <Text>
            <Badge color={"blue"} size="lg">
              {item.room}
            </Badge>
          </Text>
        </td>

        <td colSpan={2}>
          <Box
            style={{
              backgroundColor: "rgba(0, 255, 50, 0.1)",
              borderRadius: "5px",
              padding: "0.5rem",
            }}
          >
            <Button
              color="teal"
              onClick={() => {
                confirm("Zelite potrditi osebo?");
              }}
            >
              Sprejmi{" "}
            </Button>
          </Box>
        </td>
      </tr>
    );
  }

  return (
    <tr key={item.uuid}>
      <td>
        <Text size="sm" color="dimmed">
          {i + 1}
        </Text>
      </td>
      <td>
        <Group spacing="sm">
          {/* <Avatar size={40} src={item.avatar} radius={40} /> */}
          <div>
            <Text size="sm" weight={500}>
              {item.name} {item.surname}
            </Text>
            <Text size="xs" color="dimmed">
              {item.email}
            </Text>
          </div>
        </Group>
      </td>

      <td>
        <Text size="sm">{item.room}</Text>
      </td>

      <td>
        {!item.disabled ? (
          <Badge color="gray">Aktiven</Badge>
        ) : (
          <Badge color="red">Onemogočen</Badge>
        )}
      </td>
    </tr>
  );
};
