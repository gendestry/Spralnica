import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { mutate } from "swr";
import { supabaseClient } from "../supabase/supabaseClient";

export const confirmUser = ({ id }: { id: number }) => {

  return new Promise((resolve, reject) => {
    supabaseClient
      .from("user_info")
      .update({ confirmed: true })
      .eq("id", id)
      .then((res) => {
        if (res.error) {
          reject(res.error);
          showNotification({
            color: "red",
            title: "Napaka!",
            message: `Napaka pri sprejemu uporabnika!`,
          });
        } else {
          resolve(res.data);
          showNotification({
            color: "green",
            title: "Sprejeto!",
            message: `Uporabnik ${id} sprejet!`,
          });
        }
      })
    });
};

export const useConfirmUser = (id: number) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutateUser = () => {
    setLoading(true);
    confirmUser({ id })
      .then(() => {
        mutate("users");
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    loading,
    error,
    mutateUser,
  };
};
