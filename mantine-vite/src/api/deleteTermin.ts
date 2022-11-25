import { fetcher } from "./swrFetcher";


export const deleteTermin = (uuid: string) => {
	const url = `/deleteTermin/${uuid}`;
	return new Promise<void>((resolve, reject) => {
		fetcher
			.post(url)
			.then((res) => {
				resolve();
			})
			.catch((e) => {
				reject(e);
			})
			.finally(() => {
				// store.dispatch(popLoad());
			});
	});
}