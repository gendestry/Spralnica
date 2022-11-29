import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { mutate } from "swr";
import { fetcher } from "./swrFetcher";

export const deleteTermin = (id: string) => {
  const url = `/deleteTermin/${id}`;
  return new Promise<void>((resolve, reject) => {
    fetcher
      .post(url)
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

  const delTermin = (id: string) => {
    return new Promise<void>((resolve, reject) => {
      setLoading(true);
      deleteTermin(id)
        .then(() => {
          mutate(`/deleteTermin/${id}`);
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
