import { AnonymousAuth, anonymousLucia } from "./anonymousAuth"
import { createAnonymousUser } from "./createAnonymousUser"

export const createAnonymousUserAndSession =
	async (): Promise<AnonymousAuth> => {
		//if no session, create new anonymous user
		const anonymousUser = await createAnonymousUser()

		if (!anonymousUser) throw new Error("Error creating anonymous user")

		//generate new session for newly created anonymous user
		const anonymousSession = await anonymousLucia.createSession(
			anonymousUser.id,
			{},
		)

		const sessionCookie = await anonymousLucia.createSessionCookie(
			anonymousSession.id,
		)

		if (!sessionCookie)
			throw new Error(
				"Error generating session cookie from new anonymous session",
			)

		return {
			userId: anonymousUser.id,
			session: anonymousSession,
			sessionCookie,
		}
	}
