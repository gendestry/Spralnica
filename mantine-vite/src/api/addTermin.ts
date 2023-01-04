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

type AddTermin = Omit<ITermin, "id">;

const addTermin = (termin: AddTermin) => {
  const url = "/addTermin";
  return new Promise<void>((resolve, reject) => {
    fetcher
      .post<AddTermin>(url, termin)
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

export const useAddTermin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addTerminF = (termin: AddTermin) => {
    return new Promise<void>((resolve, reject) => {
      setLoading(true);
      addTermin(termin)
        .then(() => {
          mutate("getTerminsByUser/");
          showNotification({
            color: "green",
            title: "Dodano!",
            message: `Dodan termin`,
          });
          resolve();
        })
        .catch((e) => {
          setError(e);
          showNotification({
            color: "red",
            title: "Napaka!",
            message: `Napaka pri dodajanju ${e.message}`,
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
    addTerminF,
  };
};
