import { useState } from "react";
import { mutate } from "swr";
import { fetcher } from "./swrFetcher";

export const confirmUser = ({ uuid }: { uuid: string }) => {
  const url = "/setConfirmed";

  return new Promise((resolve, reject) => {
    const payload = { uuid, confirmed: true };
    console.log(payload, url);

    fetcher
      .post(url, payload)
      .then((res) => {
        console.log({ res });
        resolve(res.data);
      })
      .catch((e) => {
        reject(e);
        console.error({ e });
      })
      .finally(() => {
        // store.dispatch(popLoad());
      });
  });
};

export const useConfirmUser = (uuid: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutateUser = () => {
    setLoading(true);
    confirmUser({ uuid })
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
