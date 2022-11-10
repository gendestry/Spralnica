import {
  Avatar,
  Badge,
  Table,
  Group,
  Text,
  Select,
  ScrollArea,
  Skeleton,
} from "@mantine/core";
import { useEffect, useState } from "react";

export interface IUser {
  name: string;
  surname: string;
  room: number;
  email: string;
  uuid: string;
}

interface UsersTableProps {
  data: Promise<IUser[]>;
}

// const rolesData = ['Manager', 'Collaborator', 'Contractor'];

export function UsersRolesTable({ data }: UsersTableProps) {
  const [users, setUsers] = useState<IUser[]>([]);
  // data.map(item => console.log(item));đđ
  // console.log(data);

  useEffect(() => {
    data.then((data) => {
      setUsers(data);
    });
  }, []);

  const rows = users.map((item, index) => (
    <tr key={item.uuid}>
      <td>
        <Text size="sm" color="dimmed">
          {index + 1}
        </Text>
      </td>
      <td>
        <Group spacing="sm">
          {/* <Avatar size={40} src={item.avatar} radius={40} /> */}
          <div>
            <Text size="sm" weight={500}>
              {item.name} {item.surname}
            </Text>
            <Text size="xs" color="dimmed">
              {item.email}
            </Text>
          </div>
        </Group>
      </td>

      <td>
        <Text size="sm">{item.room}</Text>
      </td>

      {/* <td>
        <Select data={rolesData} defaultValue={item.role} variant="unstyled" />
      </td> */}
      <td>{Math.floor(Math.random() * 6 + 5)} days ago</td>
      <td>
        {Math.random() > 0.5 ? (
          <Badge fullWidth>Active</Badge>
        ) : (
          <Badge color="gray" fullWidth>
            Disabled
          </Badge>
        )}
      </td>
    </tr>
  ));

  return (
    <ScrollArea>
      <Table verticalSpacing="sm">
        <thead>
          <tr>
            <th></th>
            <th>Oseba</th>
            <th>Številka sobe</th>
            <th>Last active</th>
            <th>Status</th>
          </tr>
        </thead>
        {rows.length > 0 ? (
          <tbody>{rows}</tbody>
        ) : (
          <tbody>
            <tr>
              <td>
                <Skeleton height={14} my={10} radius="xl" />
              </td>
              <td>
                <Skeleton height={14} my={10} radius="xl" />
              </td>
              <td>
                <Skeleton height={14} my={10} radius="xl" />
              </td>
              <td>
                <Skeleton height={14} my={10} radius="xl" />
              </td>
              <td>
                <Skeleton height={14} my={10} radius="xl" />
              </td>
            </tr>
            <tr>
              <td>
                <Skeleton height={14} my={10} radius="xl" />
              </td>
              <td>
                <Skeleton height={14} my={10} radius="xl" />
              </td>
              <td>
                <Skeleton height={14} my={10} radius="xl" />
              </td>
              <td>
                <Skeleton height={14} my={10} radius="xl" />
              </td>
              <td>
                <Skeleton height={14} my={10} radius="xl" />
              </td>
            </tr>
            <tr>
              <td>
                <Skeleton height={14} my={10} radius="xl" />
              </td>
              <td>
                <Skeleton height={14} my={10} radius="xl" />
              </td>
              <td>
                <Skeleton height={14} my={10} radius="xl" />
              </td>
              <td>
                <Skeleton height={14} my={10} radius="xl" />
              </td>
              <td>
                <Skeleton height={14} my={10} radius="xl" />
              </td>
            </tr>
            {/* <Skeleton height={8} mt={6} radius="xl" /> */}
            {/* <Skeleton height={8} mt={6} width="70%" radius="xl" /> */}
          </tbody>
        )}
      </Table>
    </ScrollArea>
  );
}
