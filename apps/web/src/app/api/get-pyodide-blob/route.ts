import { NextResponse } from "next/server"
import { list } from "@vercel/blob"
import { env } from "env"

export const runtime = "edge"

export async function GET() {
	const { folders, blobs } = await list({
		mode: "folded",
		prefix: `pyodide/${env.NEXT_PUBLIC_PYODIDE_VERSION}/`,
	})
	return NextResponse.json({
		folders,
		blobs,
		indexUrl: blobs?.[0]?.url,
	})
}
