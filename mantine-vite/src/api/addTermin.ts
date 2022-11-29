import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { deleteTermin } from "./deleteTermin";
import { fetcher } from "./swrFetcher";

export interface ITermin {
  uuid: string; // user id
  id: string; // item id
  date: number;
  termin: number;
  washer: number;
}

const addTermin = (termin: ITermin) => {
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

export const useDeleteTermin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const delTermin = (termin: ITermin) => {
    return new Promise<void>((resolve, reject) => {
      setLoading(true);
      addTermin()
        .then(() => {
          mutate("getTerminsByUser/" + uuid);

          showNotification({
            color: "green",
            title: "Posodobljeno!",
            message: `Izbrisan termin`,
          });
          resolve();
        })
        .catch((e) => {
          setError(e);
          showNotification({
            color: "red",
            title: "Napaka!",
            message: `Napaka pri izbrisu ${e.message}`,
          });
          reject(e);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  return {
    loading,
    error,
    delTermin,
  };
};
