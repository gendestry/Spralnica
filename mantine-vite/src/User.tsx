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
} from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons";
import React from "react";
import { useFirebaseUser } from "./firebase";

interface IRowProps {
  dKey: string;
  data: string;
}

const InfoRow = ({ data, dKey }: IRowProps) => {
  return (
    <tr>
      <td>
        <strong>{dKey}</strong>
      </td>
      <td>{data}</td>
    </tr>
  );
};

export const User = () => {
  const user = useFirebaseUser();

  if (!user) {
    return <Paper>No connected user</Paper>;
  }

  return (
    <Container size="sm">
      <Paper p={"2rem"}>
        <Stack spacing={"md"}>
          <Flex align="center" m="lg" mb={"2rem"} justify="center">
            <Avatar radius="xl" size="lg" color="blue">
              302
            </Avatar>
            <Box m={"xl"} />
            <Title>Lan Vukušič</Title>
          </Flex>

          {/* <Divider my="sm" label={"kontakt"} labelPosition="right" />
          <Table>
            <InfoRow dKey="telefon" data={user.displayName || "zan gejj"} />
            <InfoRow dKey="e-mail" data={user.displayName || "zan gejj"} />
          </Table> */}
          <Divider my="sm" label={"kontakt"} labelPosition="right" />
          <Table>
            <InfoRow dKey="telefon" data={"00386 31 500 400"} />
            <InfoRow dKey="e-mail" data={"rando.randy@rand.com"} />
          </Table>
          {/* <Group mt={"2rem"}>
            <Button variant="filled"> spremeni geslo</Button>
          </Group> */}
          <Stack>
            <Text opacity={0.5} mt={"4rem"}>
              v primeru nepravilnih podatkov ali sprememb kontaktirajte
              predsednika
            </Text>
            <Flex align="center">
              <Text pr={"1rem"} weight={800}>
                predsednik@gmail.com
              </Text>
              <CopyButton value="https://mantine.dev" timeout={2000}>
                {({ copied, copy }) => (
                  <Tooltip
                    label={copied ? "Copied" : "Copy"}
                    withArrow
                    position="right"
                  >
                    <ActionIcon color={copied ? "teal" : "gray"} onClick={copy}>
                      {copied ? (
                        <IconCheck size={16} />
                      ) : (
                        <IconCopy size={16} />
                      )}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </Flex>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};
