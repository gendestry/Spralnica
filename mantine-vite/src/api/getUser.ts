import useSWR from "swr";
import { Tables } from "../supabase/supabase";
import { supabaseClient } from "../supabase/supabaseClient";

export type IUser = Tables<"listallusers">;
export type IUserList = Tables<"listusers">[];
export type IUserAllList = Tables<"listallusers">[];

export const fetchUser = (id: number) => {
  return new Promise<IUser>((resolve, reject) => {
    supabaseClient.rpc("getuserbyid", { uid: id }).then((res) => {
      if (res.error) {
        reject(res.error);
      } else {
        resolve(res.data[0]);
      }
    });
  });
};

export const useFetchUser = (uid: number) => {
  console.log("useFetchUser", uid);

  return useSWR<IUser>("users", () => fetchUser(uid));
};
