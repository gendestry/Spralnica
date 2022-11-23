import {
  Group,
  Badge,
  Checkbox,
  Text,
  Button,
  Box,
  Select,
  Avatar,
} from "@mantine/core";
import { IconEdit } from "@tabler/icons";
import { useState } from "react";
import { useConfirmUser } from "../api/editusers";
import { IUser } from "../api/listUsers";
import { MyModal } from "./Modal";

interface IUserRowProps {
  item: IUser;
  i: number;
}

export const UserRow = ({ item, i }: IUserRowProps) => {
  const { error, loading, mutateUser } = useConfirmUser(item.uuid);

  const mainCol = item.role === "admin" ? "red" : "";

  const user = (
    <Group spacing="sm">
      <Avatar color={mainCol}>{item.role === "admin" ? "AD" : "UP"}</Avatar>
      <div>
        <Text size="sm" weight={500} color={mainCol}>
          {item.name} {item.surname}
        </Text>
        <Text size="xs" color="dimmed">
          {item.email}
        </Text>
      </div>
    </Group>
  );

  // REEEMOVEEE FALSEEE
  if (!item.confirmed) {
    return (
      <tr key={item.uuid}>
        <td>
          <Button leftIcon={<IconEdit />} variant="light" color={mainCol}>
            {i + 1}
          </Button>
        </td>
        <td>{user}</td>

        <td>
          <Text>
            <Badge color={mainCol} size="lg">
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
              size="xs"
              loading={loading}
              onClick={() => {
                confirm("Zelite potrditi osebo?") && mutateUser();
              }}
              color={"teal"}
            >
              {error ? "Ponovi" : "Potrdi"}
            </Button>
          </Box>
        </td>
      </tr>
    );
  }

  return (
    <tr
      key={item.uuid}
      style={{
        opacity: item.disabled ? 0.2 : 1,
      }}
    >
      <td>
        {/* <Button leftIcon={<IconEdit />} variant="light" color={mainCol}>
          {i + 1}
        </Button> */}
        <MyModal mainCol={mainCol} user={item} />
      </td>
      <td>{user}</td>
      <td>
        <Badge color={mainCol} size="lg">
          {item.room}
        </Badge>
      </td>
      <td>{item.uuid}</td>

      {/* <td>
        {!item.disabled ? (
          <Badge color="green">Aktiven</Badge>
        ) : (
          <Badge color="red">Onemogočen</Badge>
        )}
      </td> */}
    </tr>
  );
};
