import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { mutate } from "swr";
import { IUser } from "./getUser";
import { supabaseClient } from "../supabase/supabaseClient";
import { cache } from "swr/dist/utils/config";

export const editUser = (user: Partial<IUser>) => {
  return new Promise((resolve, reject) => {
    supabaseClient
      .rpc("edituser", {
        param_id: user.id!,
        param_name: user.name || undefined,
        param_surname: user.surname || undefined,
        param_email: user.email || undefined,
        param_room: user.room || undefined,
        param_phone: user.phone || undefined,
        param_confirmed: user.confirmed || undefined,
        param_disabled: user.disabled || undefined,
      })
      .then((res) => {
        if (res.error) {
          reject(res.error);
          console.log(res.error);
          showNotification({
            color: "red",
            title: "Napaka!",
            message: `Napaka pri posodobitvi uporabnika!`,
          });
        } else {
          resolve(res.data);
          mutate(
            (key: any) => Array.isArray(key) && key.includes("users"),
            undefined,
            { revalidate: true }
          );
          showNotification({
            color: "green",
            title: "Posodobljeno!",
            message: `Uporabnik posodobljen!`,
          });
        }
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
          mutate(
            (key: any) => Array.isArray(key) && key.includes("users"),
            undefined,
            { revalidate: true }
          );
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
