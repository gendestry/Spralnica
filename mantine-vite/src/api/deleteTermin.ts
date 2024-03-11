import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { mutate } from "swr";
import { supabaseClient } from "../supabase/supabaseClient";

export const deleteTermin = (id: number) => {
  return new Promise<void>((resolve, reject) => {
    supabaseClient.from("termins").delete().eq("id", id).then((res) => {
      if (res.error) {
        reject(res.error);
      } else {
        resolve();
      }
    });
  });
};

export const useDeleteTermin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const delTermin = (id: number, uuid: number) => {
    return new Promise<void>((resolve, reject) => {
      setLoading(true);
      deleteTermin(id)
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
