import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers"
import { cookies, headers } from "next/headers"
import { NextRequest } from "next/server"
import { getAuth } from "@clerk/nextjs/server"
import { PrismaClient } from "@colorchordsapp/db"

import { getBaseUrl } from "../../trpc"
import { getAnonymousUserIdFromSessionId } from "./getAnonymousUserIdFromAnonymousSessionId"
import { getUserIdFromClerkId } from "./getUserIdFromClerkId"

export const getAnonymousUserFromHeaders = async (db: PrismaClient) => {
	const anonymousSessionId = cookies().get("auth_session")?.value
	if (!anonymousSessionId) return null

	return (
		(await getAnonymousUserIdFromSessionId(anonymousSessionId, db)) ?? null
	)
}

export const getClerkUserFromHeaders = async (db: PrismaClient) => {
	const clerkAuth = getAuth(
		new NextRequest(getBaseUrl(), { headers: headers() }),
	)
	const clerkId = clerkAuth.userId
	const userId = clerkId ? await getUserIdFromClerkId(clerkId, db) : null

	return userId
}

export const valdiateRequestSession = async (db: PrismaClient) => {
	let anonymousUserId: string | null = null

	try {
		anonymousUserId = await getAnonymousUserFromHeaders(db)
	} catch (e) {
		console.error(e)
	}

	let userId: string | null = null

	try {
		userId = await getClerkUserFromHeaders(db)
	} catch (e) {
		console.error(e)
	}

	return { userId, anonymousUserId }
}
