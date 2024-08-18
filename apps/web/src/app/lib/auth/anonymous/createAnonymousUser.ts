import { api } from "@/trpc/server"

export const ANONYMOUS_USER_EXPIRATION_TIME = null

export const createAnonymousUser = async () => {
	const expirationDate = ANONYMOUS_USER_EXPIRATION_TIME
		? new Date(Date.now() + ANONYMOUS_USER_EXPIRATION_TIME)
		: undefined
	const user = await api.anonymousUserRouter
		.createAnonymousUser({
			expiresAt: expirationDate,
		})
		.then((res) => res.user)

	return user
}
