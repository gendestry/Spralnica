import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Input,
  Modal,
  Select,
  Stack,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconAt,
  IconDoor,
  IconEdit,
  IconLock,
  IconPhone,
  IconUserCircle,
} from "@tabler/icons";
import { useEffect, useState } from "react";
import { useEditUser } from "../api/editUser";
import { IUser } from "../api/listUsers";
import { TerminTable } from "./TerminTable";

export interface IModalProps {
  mainCol: string;
  user: IUser;
}

export function MyModal({ mainCol, user }: IModalProps) {
  const [opened, setOpened] = useState(false);
  const { error, loading, editUserProps } = useEditUser();

  let form = useForm({
    initialValues: {
      ...user,
    },

    // validate: {
    //   email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    // },
  });

  useEffect(() => {
    form.setValues(user);
    form.setTouched({});
    form.setDirty({});
  }, [user]);

  const handleSubmit = (newUser: IUser) => {
    editUserProps(newUser).then(() => {
      setOpened(false);
    });
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
          form.reset();
        }}
        title={
          <Flex m="lg" mb={"2rem"} direction="row" align={"center"}>
            {/* <Flex align="center" justify="center"> */}
            <Avatar radius="xl" size="lg" color="blue">
              {user.room}
            </Avatar>
            <Box m={"xl"} />
            <Box>
              <Title>{`${user.name} ${user.surname}`}</Title>
            </Box>
          </Flex>
        }
      >
        <Text size="xs" opacity={0.4}>
          <strong>UUID: </strong>
          {user.uuid}
        </Text>
        <form
          onSubmit={form.onSubmit((values) => {
            handleSubmit(values);
          })}
        >
          <Stack gap={"xs"}>
            <Divider label={"Kontakt"} labelPosition="right" />
            {/* <Input icon={<IconAt />} placeholder="email" /> */}
            <Input
              leftSection={<IconAt size={16} />}
              placeholder="ime"
              __staticSelector=""
              value={"lan.vukusic@gmail.com"}
              {...form.getInputProps("email")}
            />
            <Input
              leftSection={<IconUserCircle size={16} />}
              placeholder="ime"
              __staticSelector=""
              {...form.getInputProps("name")}
            />
            <Input
              leftSection={<IconUserCircle size={16} />}
              placeholder="priimek"
              {...form.getInputProps("surname")}
            />
            <Input
              leftSection={<IconPhone size={16} />}
              placeholder="telefon"
              type="tel"
              {...form.getInputProps("phone")}
            />
            <Input
              leftSection={<IconDoor size={16} />}
              placeholder="350"
              type="number"
              {...form.getInputProps("room")}
            />
            <Switch
              onLabel="Bannan"
              offLabel="Aktiven"
              size="lg"
              color="red"
              {...form.getInputProps("disabled", { type: "checkbox" })}
            />
            <Divider label={"Administracija"} labelPosition="right" />
            <Select
              {...form.getInputProps("role")}
              label="Uporabniški tip"
              placeholder="Uporabniški tip"
              leftSection={<IconLock size={14} />}
              data={[
                { value: "admin", label: "admin" },
                { value: "user", label: "user" },
              ]}
            />
            <Flex my="md">
              <Button
                variant="light"
                style={{ flex: "1" }}
                type="submit"
                m={"sm"}
                disabled={!form.isTouched()}
                loading={loading}
              >
                Shrani
              </Button>
            </Flex>
            <Divider label={"Termini"} labelPosition="right" />

            <TerminTable uuid={user.uuid} />
          </Stack>
        </form>
      </Modal>

      <Button
        leftSection={<IconEdit />}
        variant="light"
        color={mainCol}
        onClick={() => setOpened(true)}
      >
        uredi
      </Button>
    </>
  );
}
