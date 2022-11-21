import useSWR from "swr";
import { fetcher } from "./swrFetcher";

export interface IUser {
  phone: string;
  name: string;
  surname: string;
  room: number;
  email: string;
  uuid: string;
  disabled: boolean;
  confirmed: boolean;
  role: "admin" | "user";
}

export const fetchUsers = () => {
  const url = "/allUsers";
  return new Promise<IUser[]>((resolve, reject) => {
    fetcher
      .get<IUser[]>(url)
      .then((res) => {
        // console.log(res);
        resolve(res.data);
      })
      .catch((e) => {
        reject(e);
        // console.error(e);
      })
      .finally(() => {
        // store.dispatch(popLoad());
      });
  });
};

export const useFetchUsers = () => {
  return useSWR<IUser[]>("users", fetchUsers);
};
