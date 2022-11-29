import { Alert, Table } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";
import { useGetTerminsByUser } from "../api/getTermin";

import { TerminRow } from "../User";

interface ITerminTableProps {
  uuid: string;
}

export const TerminTable = ({ uuid }: ITerminTableProps) => {
  const { data: termini, error: terminErr } = useGetTerminsByUser(uuid);

  return (
    <>
      {terminErr && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Napaka"
          color="red"
          variant="outline"
        >
          {terminErr.message}
        </Alert>
      )}

      {termini && termini.length == 0 && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Ni terminov"
          variant="outline"
        >
          Nobenih najdenih prihodnjih terminov
        </Alert>
      )}
      <Table>
        <tbody>
          {termini &&
            termini.map((termin, i) => (
              <TerminRow
                id={termin.id}
                key={termin.id + i}
                data={new Date(termin.date * 1000)}
              />
            ))}
        </tbody>
      </Table>
    </>
  );
};
