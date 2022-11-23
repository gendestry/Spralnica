import {
  Avatar,
  Badge,
  Table,
  Group,
  Text,
  Select,
  ScrollArea,
  Skeleton,
  Checkbox,
  Flex,
  Alert,
  Box,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { skeletalRows } from "../skeletons";
import { UserRow } from "./UserRow";
import { InputWithButton } from "./FancySearch";
import { fetchUsers, IUser, useFetchUsers } from "../api/listUsers";
import { IconAlertCircle } from "@tabler/icons";

interface UsersTableProps {
  data?: Promise<IUser[]>;
}

function filterSearch(search: string, users: IUser[]): IUser[] {
  if (search === "") {
    return users;
  }
  return users.filter((user) => {
    return JSON.stringify(Object.values(user))
      .toLowerCase()
      .includes(search.toLowerCase());
  });
}

export function UsersRolesTable() {
  const [search, setSearch] = useState("");

  const { data, error } = useFetchUsers();

  return (
    <ScrollArea>
      <Flex m={32} align="center" justify="center">
        <InputWithButton
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
            {filterSearch(search, data || []).map((user, i) => (
              <UserRow i={i} key={user.uuid} item={user} />
            ))}
          </tbody>
        )}
      </Table>
    </ScrollArea>
  );
}
