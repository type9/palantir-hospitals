import { PrismaClient } from "@colorchordsapp/db"

export const getAnonymousUserIdFromSessionId = async (
	anonymousSessionId: string,
	db: PrismaClient,
) => {
	const user = await db.anonymousSession.findUnique({
		where: { id: anonymousSessionId },
		select: { userId: true },
	})
	return user?.userId
}
