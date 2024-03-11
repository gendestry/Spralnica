import {
  Avatar,
  Badge,
  Button,
  Group,
  TableTd,
  TableTr,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons";
import { useEditUser } from "../api/editUser";
import { IUser } from "../api/getUser";
import { MyModal } from "./Modal";

interface IUserRowProps {
  item: IUser;
  i: number;
}

export const UserRow = ({ item: userIn, i }: IUserRowProps) => {
  // const { error, loading, mutateUser } = useConfirmUser(userIn.uuid);
  const { error, loading, editUserProps } = useEditUser();
  const [opened, { open, close }] = useDisclosure(false);

  const mainCol = "admin" === "admin" ? "red" : "";

  const user = (
    <Group gap="sm">
      <Avatar color={mainCol}>{"admin" === "admin" ? "AD" : "UP"}</Avatar>
      <div>
        <Text size="sm" w={500} c={mainCol}>
          {userIn.name} {userIn.surname}
        </Text>
        <Text size="xs" c="dimmed">
          {userIn.email}
        </Text>
      </div>
    </Group>
  );

  if (!userIn.confirmed) {
    return (
      <TableTr key={userIn.id}>
        <TableTd>
          <Button
            onClick={open}
            color={mainCol}
            size="xs"
            variant="subtle"
            leftSection={<IconPencil />}
          >
            Uredi
          </Button>
        </TableTd>
        <TableTd>{user}</TableTd>

        {/* <TableTd>
          <Badge color={mainCol} size="lg">
            {userIn.room}
          </Badge>
        </TableTd> */}

        <TableTd colSpan={2}>
          <Group
            style={{
              backgroundColor: "rgba(0, 255, 50, 0.1)",
              borderRadius: "5px",
              padding: "0.5rem",
            }}
            justify="end"
          >
            <Button
              size="xs"
              loading={loading}
              onClick={() => {
                confirm("Zelite potrditi osebo?") &&
                  editUserProps({ id: userIn.id, confirmed: true });
              }}
              color={"teal"}
            >
              {error ? "Ponovi" : "Potrdi"}
            </Button>
          </Group>
        </TableTd>
      </TableTr>
    );
  }

  return (
    <>
      <MyModal mainCol={mainCol} user={userIn} opened={opened} close={close} />
      <TableTr key={userIn.id}>
        <TableTd>
          <Button
            onClick={open}
            color={mainCol}
            size="xs"
            variant="subtle"
            leftSection={<IconPencil />}
          >
            Uredi
          </Button>
        </TableTd>
        <TableTd
          style={{
            opacity: userIn.disabled ? 0.2 : 1,
          }}
        >
          {user}
        </TableTd>
        <TableTd
          style={{
            opacity: userIn.disabled ? 0.2 : 1,
          }}
        >
          <Badge color={mainCol} size="lg">
            {userIn.room}
          </Badge>
        </TableTd>
        <TableTd
          style={{
            opacity: userIn.disabled ? 0.2 : 1,
          }}
        >
          {userIn.phone}
        </TableTd>

        {/* <TableTd>
      {!item.disabled ? (
        <Badge color="green">Aktiven</Badge>
      ) : (
        <Badge color="red">Onemogočen</Badge>
      )}
    </TableTd> */}
      </TableTr>
    </>
  );
};
