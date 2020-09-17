import useSWR, { ConfigInterface, responseInterface } from 'swr'

import fetchApi from '../components/utils/fetchApi'

export default function useFetch<TData extends Record<string, unknown> | unknown[]>(
	url: string,
	config?: ConfigInterface<TData, Error>,
): responseInterface<TData, Error> {
	return useSWR<TData, Error>(url, (url) => fetchApi<TData>(url), config)
}
