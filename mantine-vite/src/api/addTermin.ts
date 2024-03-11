import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { ITermin } from "./getTermin";
import { supabaseClient } from "../supabase/supabaseClient";

type AddTermin = Omit<ITermin, "id">;

const addTermin = (termin: AddTermin) => {
  return new Promise<void>((resolve, reject) => {
    supabaseClient.from("termins").insert([termin]).then((res) => {
      if (res.error) {
        reject(res.error);
      } else {
        resolve();
      }
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
