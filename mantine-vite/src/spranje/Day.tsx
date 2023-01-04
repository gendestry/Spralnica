import { ITermin } from "../api/addTermin";
import { TableDay } from "./TableDay";

export const Day = ({ date, data }: { date: Date; data: ITermin[] }) => {
  const from = new Date(date);
  from.setHours(0, 0, 0, 0);

  console.log({ from });

  return <TableDay termini={data} date={from} />;
};
