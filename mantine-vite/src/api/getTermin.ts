import useSWR, { mutate } from "swr";
import { supabaseClient } from "../supabase/supabaseClient";
import { Tables } from "../supabase/supabase";

export type ITermin = Tables<"termins">;

const getTermin = (id: string) => {
  return new Promise<ITermin>((resolve, reject) => {
    supabaseClient
      .from("termins")
      .select("*")
      .eq("id", id)
      .then((res) => {
        if (res.error) {
          reject(res.error);
        } else {
          resolve(res.data[0]);
        }
      });
  });
};
export const useGetTermin = (uid: string) => {
  return useSWR<ITermin>("getTermin/" + uid, () => getTermin(uid));
};

const getTerminsByUser = (uid: number, active?: boolean) => {
  return new Promise<ITermin[]>((resolve, reject) => {
    supabaseClient
      .rpc("getterminsbyuid", { u_id: uid, active: active })
      .then((res) => {
        if (res.error) {
          reject(res.error);
        } else {
          resolve(res.data);
        }
      });
  });
};
export const useGetTerminsByUser = (uid: number, active: boolean = true) => {
  // const stillActive = active ? "/active" : "";
  return useSWR<ITermin[]>("getTerminsByUser/" + uid, () =>
    getTerminsByUser(uid, active)
  );
};

const getTerminsInRange = (start: string, end: string) => {
  return new Promise<ITermin[]>((resolve, reject) => {
    supabaseClient
      .rpc("getterminsinrange", { start: start, stop: end })
      .then((res) => {
        if (res.error) {
          reject(res.error);
        } else {
          resolve(res.data);
        }
      });
  });
};
export const useGetTerminsInRange = (start: string, end: string) => {
  return useSWR<ITermin[]>("getTerminsInRange/" + start + "/" + end, () =>
    getTerminsInRange(start, end)
  );
};

const getTerminsMonthly = (month: number, year: number) => {
  return new Promise<ITermin[]>((resolve, reject) => {
    supabaseClient
      .rpc("getterminsmonthyear", { month: month, year: year })
      .then((res) => {
        if (res.error) {
          reject(res.error);
        } else {
          resolve(res.data);
        }
      });
  });
};

export const useGetTerminsMonthly = (month: number, year: number) => {
  return useSWR<ITermin[]>("getTerminsMonthly/" + month + "/" + year, () =>
    getTerminsMonthly(month, year)
  );
};
