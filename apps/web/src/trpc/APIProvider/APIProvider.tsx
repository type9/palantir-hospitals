"use client"

import { ReactNode, useState } from "react"
import { AppRouter } from "@colorchordsapp/api/trpc"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client"
import { createTRPCReact } from "@trpc/react-query"
import { SuperJSON } from "superjson"

import { getTRPCUrl } from "@/webmeta/url"

export const api = createTRPCReact<AppRouter>()

export const APIProvider = ({ children }: { children: ReactNode }) => {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						refetchOnWindowFocus: false,
						refetchOnMount: false,
					},
				},
			}),
	)
	const [trpcClient] = useState(() =>
		api.createClient({
			links: [
				loggerLink({
					enabled: (op) =>
						process.env.NODE_ENV === "development" ||
						(op.direction === "down" && op.result instanceof Error),
				}),
				unstable_httpBatchStreamLink({
					transformer: SuperJSON,
					url: getTRPCUrl(),
					async headers() {
						const headers = new Headers()
						headers.set("x-trpc-source", "nextjs-react")
						return headers
					},
				}),
			],
		}),
	)

	return (
		<QueryClientProvider client={queryClient}>
			<api.Provider client={trpcClient} queryClient={queryClient}>
				{children}
			</api.Provider>
		</QueryClientProvider>
	)
}
