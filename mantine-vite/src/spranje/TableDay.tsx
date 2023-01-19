import {
  Alert,
  Badge,
  Box,
  Button,
  createStyles,
  Flex,
  Group,
  LoadingOverlay,
  Modal,
  ScrollArea,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { IconAlertCircle, IconCheck, IconFlag, IconTrash } from "@tabler/icons";
import { useState } from "react";
import { ITermin, useAddTermin } from "../api/addTermin";
import { useIsMobile } from "../hooks/media";
import { me } from "../store/store";
import { RowProps } from "./AccordioList";
import { UserButton } from "./UserButton";
import { useStore } from "@nanostores/react";
import { useFetchUser } from "../api/getUser";
import { generateTermini } from "./terminiUtil";

const useStyles = createStyles((theme) => ({
  name: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors[theme.primaryColor][6]
        : theme.colors[theme.primaryColor][4],
  },
}));

const ReservationTd = ({
  washer,
  date,
  termin,
}: {
  washer: number;
  date: Date;
  termin: number;
}) => {
  const mobile = useIsMobile();
  const { addTerminF, loading, error } = useAddTermin();
  const selfUser = useStore(me);

  return (
    <Flex align="center">
      <Button
        ml={mobile ? "xs" : "xl"}
        // miw={mobile ? 100 : 250}
        variant="subtle"
        onClick={() => {
          confirm("Ali si prepričan, da želiš rezervirati termin?") &&
            addTerminF({
              uuid: selfUser?.uuid || "",
              date: date.getTime() / 1000,
              termin: termin,
              washer: washer,
            });
        }}
        size={mobile ? "xs" : "md"}
        loading={loading}
        disabled={selfUser == null}
        leftIcon={mobile ? undefined : <IconCheck />}
      >
        Rezerviraj
      </Button>
    </Flex>
  );
};

const ReservationTdUser = ({
  uuid,
  setModal,
}: {
  uuid: string;
  setModal: (arg0: boolean) => void;
}) => {
  const { data: user, error } = useFetchUser(uuid);
  if (error) {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Napaka"
        color="red"
        variant="outline"
      >
        Napaka pridobivanja uporabnik
      </Alert>
    );
  }
  if (!user) {
    return <LoadingOverlay visible={true} overlayBlur={2} />;
  }

  return (
    <UserButton
      email={user.email}
      name={user.name + " " + user.surname}
      maw={300}
      onClick={() => setModal(true)}
    />
  );
};

interface ReservationModalProps {
  opened: boolean;
  setOpened: (arg0: boolean) => void;
  hourFrom: number;
  hourTo: number;
  uuid: string;
}
const ReservationModal = ({
  hourFrom,
  hourTo,
  opened,
  setOpened,
  uuid,
}: ReservationModalProps) => {
  const { data: user, error: userErr, mutate } = useFetchUser(uuid);
  const { classes } = useStyles();
  const { addTerminF, error: terminErr, loading } = useAddTermin();

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title={`Rezervacija za ${hourFrom}:00 - ${hourTo}:00`}
    >
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Preberi!"
        variant="light"
        my="xl"
      >
        Z osebo se poskusi najprej dogovoriti preko telefona.
        <p>
          Če se ne boš uspel dogovoriti, lahko osebo prijaviš, prijavo pa bo
          urejal predsednik.
        </p>
      </Alert>

      <Flex align="center" justify="space-between">
        <Title className={classes.name}>
          {user?.name + " " + user?.surname}
        </Title>
        <Badge size="xl" mt="2">
          {user?.room}
        </Badge>
      </Flex>
      <Stack spacing="xs" align="flex-start">
        <Box>
          <Text>{user?.email}</Text>
          <Text>{user?.phone}</Text>
        </Box>
      </Stack>

      <Group mt="xl" position="apart">
        <Button.Group>
          <Button
            variant="light"
            rightIcon={<IconFlag />}
            color="red"
            onClick={() => {
              confirm("Ali si prepričan, da želiš prijaviti osebo?") &&
                alert("Prijavljeno");
              setOpened(false);
            }}
          >
            Prijavi
          </Button>
          <Button
            variant="light"
            rightIcon={<IconTrash />}
            color="red"
            onClick={() => {
              confirm("Ali si prepričan, da želiš prijaviti osebo?") &&
                alert("Prijavljeno");
              setOpened(false);
            }}
          >
            Zbriši termin
          </Button>
        </Button.Group>
        <Button
          variant="default"
          onClick={() => {
            setOpened(false);
          }}
        >
          Zapri
        </Button>
      </Group>
    </Modal>
  );
};

interface UserRowProps {
  hourFrom: number;
  hourTo: number;
  uuid: string;
}
const UserRow = ({ hourFrom, hourTo, uuid }: UserRowProps) => {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <ReservationModal
        hourFrom={hourFrom}
        hourTo={hourTo}
        opened={opened}
        setOpened={setOpened}
        uuid={uuid}
      />
      <ReservationTdUser setModal={setOpened} uuid={uuid} />
    </>
  );
};

export const TableDay = ({
  termini,
  date,
}: {
  termini: ITermin[];
  date: Date;
}) => {
  // termini are an array of reserved slots and their user info.
  // Since we need the free slots as well, we need to generate this info
  const newTerm = generateTermini(termini);
  console.log({ newTerm });

  return (
    <ScrollArea>
      <Table verticalSpacing="xs">
        <thead>
          <tr>
            <th>Stroj 1</th>
            <th>Stroj 2</th>
            <th>Termin</th>
          </tr>
        </thead>
        <tbody>
          {newTerm.map((item, i) => {
            const left = item[0];
            const right = item[1];

            const hourFrom = 3 * i;
            const hourTo = 3 * i + 3;

            return (
              <tr key={i}>
                <td>
                  {left ? (
                    <UserRow
                      hourFrom={hourFrom}
                      hourTo={hourTo}
                      uuid={left.uuid}
                    />
                  ) : (
                    <ReservationTd washer={1} termin={i} date={date} />
                  )}
                </td>
                <td>
                  {right ? (
                    <UserRow
                      hourFrom={hourFrom}
                      hourTo={hourTo}
                      uuid={right.uuid}
                    />
                  ) : (
                    <ReservationTd washer={2} termin={i} date={date} />
                  )}
                </td>
                <td>
                  {hourFrom}-{hourTo}h
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </ScrollArea>
  );
};
