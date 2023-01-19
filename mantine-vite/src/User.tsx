import {
  Text,
  Box,
  Container,
  Image,
  Paper,
  Stack,
  Title,
  Flex,
  Table,
  Divider,
  Avatar,
  Group,
  Button,
  CopyButton,
  Tooltip,
  ActionIcon,
  Badge,
  Alert,
} from "@mantine/core";
import { IconCheck, IconCopy, IconTrash } from "@tabler/icons";
import React from "react";
import { useDeleteTermin } from "./api/deleteTermin";
import { useFetchUser } from "./api/getUser";
import { useFirebaseUser } from "./firebase";
import { TerminTable } from "./userMgmt/TerminTable";

interface IRowProps {
  dKey: string;
  data: string;
}

export const InfoRow = ({ data, dKey }: IRowProps) => {
  return (
    <tr>
      <td>
        <strong>{dKey}</strong>
      </td>
      <td>{data}</td>
    </tr>
  );
};

export const TerminRow = ({
  washer,
  date,
  id,
  uuid,
}: {
  washer: number;
  date: Date;
  id: string;
  uuid: string;
}) => {
  const { delTermin, error, loading } = useDeleteTermin();
  return (
    <tr>
      <td>
        <Badge color={washer === 1 ? "blue" : "orange"} size="lg">
          {date.toLocaleDateString() + " " + date.toLocaleTimeString()}
        </Badge>
      </td>
      <td>
        <ActionIcon
          loading={loading}
          disabled={error != null}
          onClick={() => {
            delTermin(id, uuid);
          }}
        >
          <IconTrash size={18} />
        </ActionIcon>
      </td>
    </tr>
  );
};

const PresidentInfo = () => {
  const mail = "predsednik@gmail.com";
  return (
    <Stack>
      <Text opacity={0.5} mt={"4rem"}>
        v primeru nepravilnih podatkov ali sprememb kontaktirajte predsednika
      </Text>
      <Flex align="center">
        <Text pr={"1rem"} weight={800}>
          {mail}
        </Text>
        <CopyButton value={mail} timeout={2000}>
          {({ copied, copy }) => (
            <Tooltip
              label={copied ? "Copied" : "Copy"}
              withArrow
              position="right"
            >
              <ActionIcon color={copied ? undefined : "gray"} onClick={copy}>
                {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      </Flex>
    </Stack>
  );
};

export const User = () => {
  const user = useFirebaseUser();
  const { data, error } = useFetchUser(user?.uid || "");

  if (!user || !data) {
    return <Paper>No connected user</Paper>;
  }

  if (error) {
    return (
      <Alert>
        <Text>Ups, prišlo je do napake</Text>
        <Text>{error.message}</Text>
      </Alert>
    );
  }

  return (
    <Container size="sm">
      <Paper p={"2rem"}>
        <Stack spacing={"md"}>
          <Flex align="center" m="lg" mb={"2rem"} justify="center">
            <Avatar radius="xl" size="lg">
              {data.room}
            </Avatar>
            <Box m={"xl"} />
            <Title>
              {data.name} {data.surname}
            </Title>
          </Flex>
          <Divider my="sm" label={"Kontakt"} labelPosition="right" />
          <Table>
            <tbody>
              <InfoRow dKey="telefon" data={data.phone} />
              <InfoRow dKey="e-mail" data={data.email} />
            </tbody>
          </Table>
          {data.disabled && <Alert>OJOJ BANAN SI</Alert>}
          <TerminTable uuid={user?.uid} />
          <PresidentInfo />
        </Stack>
      </Paper>
    </Container>
  );
};
