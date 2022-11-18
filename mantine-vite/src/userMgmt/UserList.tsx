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
} from "@mantine/core";
import { useEffect, useState } from "react";
import { IUser, useListUsers } from "./listUsers";
import { skeletalRows } from "../skeletons";
import { UserRow } from "./UserRow";
import { InputWithButton } from "./FancySearch";

interface UsersTableProps {
  data: Promise<IUser[]>;
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

export function UsersRolesTable({ data }: UsersTableProps) {
  const [search, setSearch] = useState("");
  // data.map(item => console.log(item));đđ
  // console.log(data);
  const { isLoading, isError, users } = useListUsers();
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
            <th>Status</th>
          </tr>
        </thead>
        {users && users.length > 0 ? (
          <tbody>
            {filterSearch(search, users).map((user, i) => {
              return <UserRow item={user} i={i} key={i} />;
            })}
          </tbody>
        ) : (
          <tbody>{skeletalRows}</tbody>
        )}
      </Table>
    </ScrollArea>
  );
}
