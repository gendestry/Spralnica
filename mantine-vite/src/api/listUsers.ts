import useSWR from "swr";
import { supabaseClient } from "../supabase/supabaseClient";
import { IUser, IUserAllList, IUserList } from "./getUser";

export const fetchUsers = (search: string) => {
  if (search.length < 3)
    return new Promise<IUserList>((resolve, reject) => {
      supabaseClient
        .from("listusers")
        .select("*")
        .order("room", { ascending: true })
        .then((res) => {
          if (res.error) {
            reject(res.error);
          } else {
            resolve(res.data);
          }
        });
    });
  return new Promise<IUserList>((resolve, reject) => {
    supabaseClient
      .from("listusers")
      .select("*")
      .textSearch("search_name_surname", search)
      .order("room", { ascending: true })
      .then((res) => {
        if (res.error) {
          reject(res.error);
        } else {
          resolve(res.data);
        }
      });
  });
};

export const useFetchUsers = (search: string) => {
  return useSWR<IUserList>(["users", `users/${search}`], () =>
    fetchUsers(search)
  );
};
