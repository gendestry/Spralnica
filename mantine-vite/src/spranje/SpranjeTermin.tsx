import { Badge, Paper } from "@mantine/core";
import { IUser } from "../api/listUsers";

export interface ITerminProps {
  hourFrom: number;
  hourTo: number;
  user?: IUser;
  machine: 1 | 2;
}

export const Termin = ({ hourFrom, hourTo, machine, user }: ITerminProps) => {
  return <Paper p={"2rem"} m="2rem"></Paper>;
};
