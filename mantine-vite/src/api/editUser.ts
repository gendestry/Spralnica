import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { mutate } from "swr";
import { IUser } from "./listUsers";
import { fetcher } from "./swrFetcher";

export const editUser = (user: Partial<IUser>) => {
  const url = "/updateUser";

  return new Promise((resolve, reject) => {
    const payload = user;

    fetcher
      .post(url, payload)
      .then((res) => {
        resolve(res.data);
        showNotification({
          color: "green",
          title: "Posodobljeno!",
          message: `Uporabnik ${user.name} posodobljen!`,
        });
      })
      .catch((e: Error) => {
        reject(e);
        showNotification({
          color: "red",
          title: "Napaka!",
          message: `Napaka pri posodobitvi${e.message}`,
        });
      })
      .finally(() => {
        // store.dispatch(popLoad());
      });
  });
};

export const useEditUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const editUserProps = (user: Partial<IUser>) => {
    return new Promise<void>((resolve, reject) => {
      setLoading(true);
      editUser(user)
        .then(() => {
          mutate("users");
          resolve();
        })
        .catch((e) => {
          setError(e);
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
    editUserProps,
  };
};
