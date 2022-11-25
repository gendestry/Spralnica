import { ITermin } from "./addTermin";
import { fetcher } from "./swrFetcher";

export const getTermin = (id: string) => {
  const url = `/termin/${id}`;
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
}

export const getTreminsByUser = (uuid: string, active: boolean = true) => {
  const stillActive = active ? "/active" : "";
  const url = `/terminByUser/${uuid}${stillActive}`;
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
}

export const getTerminsInRange = (start: number, end: number) => {
  const url = `/terminInRange/${start}/${end}`;
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
}