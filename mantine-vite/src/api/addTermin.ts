import { fetcher } from "./swrFetcher";

export interface ITermin {
  uuid: string; // user id
  id: string; // item id
  date: number;
  termin: number;
  washer: number;
}

export const addTermin = (termin: ITermin) => {
  const url = "/addTermin";
  return new Promise<void>((resolve, reject) => {
    fetcher
      .post<ITermin>(url, termin)
      .then((res) => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      })
      .finally(() => {
        // store.dispatch(popLoad());
      });
  });
};
