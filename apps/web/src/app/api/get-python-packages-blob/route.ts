import { NextResponse } from "next/server"
import { list } from "@vercel/blob"

export const runtime = "edge"

export async function GET() {
	const { blobs } = await list({
		mode: "folded",
		prefix: `python-packages/`,
	})
	return NextResponse.json({
		blobs,
		indexUrl: blobs?.[0]?.url,
	})
}
