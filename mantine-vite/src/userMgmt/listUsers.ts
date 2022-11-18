import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export interface IUser {
  name: string;
  surname: string;
  room: number;
  email: string;
  uuid: string;
  disabled: boolean;
  confirmed: boolean;
}

// list users
export const useListUsers = () => {
  const { data, error } = useSWR<IUser[]>(
    import.meta.env.VITE_FUNCTIONS_URL + "/allUsers",
    fetcher
  );
  return {
    users: data,
    isLoading: !error && !data,
    isError: error,
  };
};

// toggle user enabled
export const useSetConfirmed = () => {
  const { data, error } = useSWR<IUser[]>(
    import.meta.env.VITE_FUNCTIONS_URL + "/setConfirmed",
    fetcher
  );
  return {
    users: data,
    isLoading: !error && !data,
    isError: error,
  };
};
