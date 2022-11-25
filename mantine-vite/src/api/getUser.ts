import useSWR from "swr";
import { IUser } from "./listUsers";
import { fetcher } from "./swrFetcher";

export const fetchUser = (uuid: string) => {
  uuid = "JVgdaOyiUXvQVCR4mN8W8gX0H7H0";
  const url = `/user/${uuid}`;
  return new Promise<IUser>((resolve, reject) => {
    fetcher
      .get<IUser>(url)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e);
      })
      .finally(() => {
        // store.dispatch(popLoad());
      });
  });
};

export const useFetchUser = (uuid: string) => {
  return useSWR<IUser>("users", () => fetchUser(uuid));
};
