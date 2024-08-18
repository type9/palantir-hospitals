import { headers } from "next/headers"

import { api } from "@/trpc/server"

export async function POST(req: Request) {
	const headersPayload = headers()
	const body = JSON.stringify(await req.json())
	const result = await api.clerk.syncClerkUsersProcedure({
		svixId: headersPayload.get("svix-id") ?? "",
		svixTimestamp: headersPayload.get("svix-timestamp") ?? "",
		svixSignature: headersPayload.get("svix-signature") ?? "",
		body,
	})
	return new Response(JSON.stringify(result), {
		headers: {
			"content-type": "application/json",
		},
	})
}
