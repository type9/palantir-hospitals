import { NextRequest } from "next/server"

import { AnonymousAuth, anonymousLucia } from "./anonymousAuth"

export const getAnonymousUser = async (
	req: NextRequest,
): Promise<AnonymousAuth | undefined> => {
	const anonymousSessionId = req.cookies.get(
		anonymousLucia.sessionCookieName,
	)?.value

	//if no cookie, return undefined
	if (!anonymousSessionId) return undefined

	const { user, session } =
		await anonymousLucia.validateSession(anonymousSessionId)

	//if session is valid and fresh, set the cookie again
	if (session && session.expiresAt > new Date()) {
		const sessionCookie = anonymousLucia.createSessionCookie(session.id)

		return { userId: user.id, session, sessionCookie }
	}

	if (user) {
		//if session is invalid or stale, create new session
		const newSession = await anonymousLucia.createSession(user.id, {})
		const sessionCookie = anonymousLucia.createSessionCookie(newSession.id)

		return { userId: user.id, session: newSession, sessionCookie }
	}
}
