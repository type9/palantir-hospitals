import { PrismaClient } from "@colorchordsapp/db"

export const getUserIdFromClerkId = async (
	clerkId: string,
	db: PrismaClient,
) => {
	const user = await db.user.findUnique({
		where: { clerkId },
		select: { id: true },
	})
	return user?.id ?? null
}
