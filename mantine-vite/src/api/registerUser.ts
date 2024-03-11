import { useState } from "react";
import { mutate } from "swr";
import { IRegisterUser} from "../Register";
import { supabaseClient } from "../supabase/supabaseClient";

export const useRegisterUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const registerUser = (user: IRegisterUser) => {
    return new Promise<void>((resolve, reject) => {
      setLoading(true);
      supabaseClient.auth
        .signUp({
          email: user.email,
          password: user.password,
          options: {
            data: {
              name: user.name,
              surname: user.surname,
              room: user.room,
              phone: user.phone,
            },
          },
        })
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

  const login = (user: { email: string; password: string }) => {
    return new Promise<void>((resolve, reject) => {
      setLoading(true);
      supabaseClient.auth
        .signInWithPassword({
          email: user.email,
          password: user.password,
        })
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
    login,
  };
};
