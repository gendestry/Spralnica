import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { mutate } from "swr";
import { IRegisterForm } from "../Register";
import { IUser } from "./listUsers";
import { fetcher } from "./swrFetcher";

export const register = (user: IRegisterForm) => {
  const url = "/registerUser";

  return new Promise((resolve, reject) => {
    const payload = user;

    fetcher
      .post(url, payload)
      .then((res) => {
        resolve(res.data);
        showNotification({
          color: "green",
          title: "Uporabnik registriran!",
          message: `Yo ${user.name}! vabljen.`,
        });
      })
      .catch((e: Error) => {
        reject(e);
        showNotification({
          color: "red",
          title: "Napaka!",
          message: `Napaka pri registraciji ${e.name}}`,
        });
      })
      .finally(() => {
        // store.dispatch(popLoad());
      });
  });
};

export const useRegisterUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const registerUser = (user: IRegisterForm) => {
    return new Promise<void>((resolve, reject) => {
      setLoading(true);
      register(user)
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
    registerUser,
  };
};
