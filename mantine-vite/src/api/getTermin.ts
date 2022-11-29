import useSWR, { mutate } from "swr";
import { ITermin } from "./addTermin";
import { fetcher } from "./swrFetcher";

const getTermin = (id: string) => {
  const url = `/getTermin/${id}`;
  return new Promise<ITermin>((resolve, reject) => {
    fetcher
      .get<ITermin>(url)
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
export const useGetTermin = (uuid: string) => {
  return useSWR<ITermin>("getTermin/" + uuid, () => getTermin(uuid));
};

const getTerminsByUser = (uuid: string, active: boolean = true) => {
  const stillActive = active ? "/active" : "";
  const url = `/getTerminsByUser/${uuid}${stillActive}`;
  return new Promise<ITermin[]>((resolve, reject) => {
    fetcher
      .get<ITermin[]>(url)
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
export const useGetTerminsByUser = (uuid: string, active: boolean = true) => {
  // const stillActive = active ? "/active" : "";
  return useSWR<ITermin[]>("getTerminsByUser/" + uuid, () =>
    getTerminsByUser(uuid, active)
  );
};

const getTerminsInRange = (start: number, end: number) => {
  const url = `/getTerminsInRange/${start}/${end}`;
  return new Promise<ITermin[]>((resolve, reject) => {
    fetcher
      .get<ITermin[]>(url)
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
export const useGetTerminsInRange = (start: number, end: number) => {
  return useSWR<ITermin[]>("getTerminsInRange/" + start + "/" + end, () =>
    getTerminsInRange(start, end)
  );
};
