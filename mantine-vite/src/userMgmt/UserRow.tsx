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
import { useConfirmUser } from "../api/confirmUser";
import { useEditUser } from "../api/editUser";
import { IUser } from "../api/listUsers";
import { MyModal } from "./Modal";

interface IUserRowProps {
  item: IUser;
  i: number;
}

export const UserRow = ({ item: userIn, i }: IUserRowProps) => {
  const { error, loading, mutateUser } = useConfirmUser(userIn.uuid);

  const mainCol = userIn.role === "admin" ? "red" : "";

  const user = (
    <Group spacing="sm">
      <Avatar color={mainCol}>{userIn.role === "admin" ? "AD" : "UP"}</Avatar>
      <div>
        <Text size="sm" weight={500} color={mainCol}>
          {userIn.name} {userIn.surname}
        </Text>
        <Text size="xs" color="dimmed">
          {userIn.email}
        </Text>
      </div>
    </Group>
  );

  // REEEMOVEEE FALSEEE
  if (!userIn.confirmed) {
    return (
      <tr key={userIn.uuid}>
        <td>
          <Button leftIcon={<IconEdit />} variant="light" color={mainCol}>
            {i + 1}
          </Button>
        </td>
        <td>{user}</td>

        <td>
          <Text>
            <Badge color={mainCol} size="lg">
              {userIn.room}
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
      key={userIn.uuid}
      style={{
        opacity: userIn.disabled ? 0.2 : 1,
      }}
    >
      <td>
        {/* <Button leftIcon={<IconEdit />} variant="light" color={mainCol}>
          {i + 1}
        </Button> */}
        <MyModal mainCol={mainCol} user={userIn} />
      </td>
      <td>{user}</td>
      <td>
        <Badge color={mainCol} size="lg">
          {userIn.room}
        </Badge>
      </td>
      <td>{userIn.phone}</td>

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
