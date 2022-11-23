import { forwardRef, useEffect, useState } from "react";
import {
  Modal,
  Button,
  Group,
  Avatar,
  Box,
  Divider,
  Flex,
  Stack,
  Table,
  Title,
  Input,
  Select,
  Text,
  Switch,
} from "@mantine/core";
import {
  IconAt,
  IconDoor,
  IconEdit,
  IconLock,
  IconPhone,
  IconUserCircle,
} from "@tabler/icons";
import { InfoRow, TerminRow } from "../User";
import { useForm, UseFormReturnType } from "@mantine/form";
import { IUser } from "../api/listUsers";
import { useEditUser } from "../api/editUser";

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
    console.log(newUser);
    editUserProps(newUser).then(() => {
      setOpened(false);
      // form.reset();
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
          <Flex align="center" m="lg" mb={"2rem"} justify="center">
            <Avatar radius="xl" size="lg" color="blue">
              {user.room}
            </Avatar>
            <Box m={"xl"} />
            <Title>{`${user.name} ${user.surname}`}</Title>
          </Flex>
        }
      >
        <form
          onSubmit={form.onSubmit((values) => {
            handleSubmit(values);
          })}
        >
          <Stack spacing={"xs"}>
            <Divider label={"Kontakt"} labelPosition="right" />
            {/* <Input icon={<IconAt />} placeholder="email" /> */}
            <Input
              icon={<IconAt size={16} />}
              placeholder="ime"
              __staticSelector=""
              value={"lan.vukusic@gmail.com"}
              {...form.getInputProps("email")}
            />
            <Input
              icon={<IconUserCircle size={16} />}
              placeholder="ime"
              __staticSelector=""
              {...form.getInputProps("name")}
            />
            <Input
              icon={<IconUserCircle size={16} />}
              placeholder="priimek"
              {...form.getInputProps("surname")}
            />
            <Input
              icon={<IconPhone size={16} />}
              placeholder="telefon"
              type="tel"
              {...form.getInputProps("phone")}
            />
            <Input
              icon={<IconDoor size={16} />}
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
              icon={<IconLock size={14} />}
              data={[
                { value: "admin", label: "admin" },
                { value: "user", label: "user" },
              ]}
            />
            <Divider label={"Termini"} labelPosition="right" />
            <Table>
              <TerminRow data={new Date()} />
              <TerminRow data={new Date("05-11-2022")} />
              <TerminRow data={new Date("12-11-2022")} />
            </Table>

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
              {/* <Button color="red" variant="outline" m={"sm"}>
                Ban
              </Button> */}
            </Flex>
          </Stack>
        </form>
      </Modal>

      <Button
        leftIcon={<IconEdit />}
        variant="light"
        color={mainCol}
        onClick={() => setOpened(true)}
      >
        uredi
      </Button>
    </>
  );
}
