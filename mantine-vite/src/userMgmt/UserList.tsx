import { Alert, Flex, ScrollArea, Table } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";
import { useState } from "react";
import { IUser, useFetchUsers } from "../api/listUsers";
import { skeletalRows } from "../skeletons";
import { InputWithButton } from "./FancySearch";
import { UserRow } from "./UserRow";

interface UsersTableProps {
  data?: Promise<IUser[]>;
}

function filterSearch(search: string, users: IUser[]): IUser[] {
  if (search === "") {
    return users;
  }
  return (
    users.filter((user) => {
      return JSON.stringify(Object.values(user))
        .toLowerCase()
        .includes(search.toLowerCase());
    }) || []
  );
}

export function UsersRolesTable() {
  const [search, setSearch] = useState("");

  const { data, error } = useFetchUsers();

  const filtered = filterSearch(search, data || []);

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
        <thead>
          <tr>
            <th></th>
            <th>Oseba</th>
            <th>Številka sobe</th>
            <th>Telefon</th>
          </tr>
        </thead>
        {error && (
          <tbody>
            <tr>
              <td colSpan={4}>
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  title="Jebiga"
                  color="red"
                  variant="outline"
                >
                  Neki je šlo narobe. Probi osvežit stran. Detajli v konzoli.
                </Alert>
              </td>
            </tr>
          </tbody>
        )}
        {data && data.length == 0 && (
          <tbody>
            <tr>
              <td colSpan={4}>
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  title="Ni uporabnikov"
                  variant="outline"
                >
                  V bazi ni bil najden noben registriran uporabnik. Naj se kdo
                  registrira ...
                </Alert>
              </td>
            </tr>
          </tbody>
        )}
        {!data && !error && <tbody>{skeletalRows}</tbody>}
        {!error && (
          <tbody>
            {filtered.map &&
              filtered.map((user, i) => (
                <UserRow i={i} key={user.uuid} item={user} />
              ))}
          </tbody>
        )}
      </Table>
    </ScrollArea>
    // </Flex>
  );
}
