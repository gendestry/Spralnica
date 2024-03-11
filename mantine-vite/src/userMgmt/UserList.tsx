import {
  Alert,
  Flex,
  ScrollArea,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconAlertCircle } from "@tabler/icons";
import { useState } from "react";
import { useFetchUsers } from "../api/listUsers";
import { skeletalRows } from "../skeletons";
import { InputWithButton } from "./FancySearch";
import { UserRow } from "./UserRow";

export function UsersRolesTable() {
  const [search, setSearch] = useState("");
  const [debounced] = useDebouncedValue(search, 300);

  const { data, error } = useFetchUsers(debounced);

  return (
    <ScrollArea m="lg">
      {/* <Flex direction="column"> */}
      <Flex m={32} align="center" justify="center">
        <InputWithButton
          disabled={data?.length == 0}
          value={search}
          onChange={(e) => {
            setSearch(e.currentTarget.value);
          }}
        />
      </Flex>
      <Table verticalSpacing="sm">
        <TableThead>
          <TableTr>
            <TableTh></TableTh>
            <TableTh>Oseba</TableTh>
            <TableTh>Številka sobe</TableTh>
            <TableTh>Telefon</TableTh>
          </TableTr>
        </TableThead>
        {error && (
          <TableTbody>
            <TableTr>
              <TableTd colSpan={4}>
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  title="Jebiga"
                  color="red"
                  variant="outline"
                >
                  Neki je šlo narobe. Probi osvežit stran. Detajli v konzoli.
                </Alert>
              </TableTd>
            </TableTr>
          </TableTbody>
        )}
        {data && data.length == 0 && (
          <TableTbody>
            <TableTr>
              <TableTd colSpan={4}>
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  title="Ni uporabnikov"
                  variant="outline"
                >
                  V bazi ni bil najden noben registriran uporabnik. Naj se kdo
                  registrira ...
                </Alert>
              </TableTd>
            </TableTr>
          </TableTbody>
        )}
        {!data && !error && <TableTbody>{skeletalRows}</TableTbody>}
        {!error && data && (
          <TableTbody>
            {data.map((user, i) => (
              <UserRow i={i} key={user.id} item={user} />
            ))}
          </TableTbody>
        )}
      </Table>
    </ScrollArea>
    // </Flex>
  );
}
