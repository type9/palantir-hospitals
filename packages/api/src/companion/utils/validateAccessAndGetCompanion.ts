import { TRPCError } from "@trpc/server"

import { WithServerContext } from "../../trpc"

export const validateAccessAndGetCompanion = async ({
	ctx,
	remoteId,
}: WithServerContext<{ remoteId: string }>) => {
	const companion = await ctx.db.savedCompanion.findUnique({
		where: { shortId: remoteId },
		include: { user: true },
	})

	if (!companion) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Companion not found",
		})
	}

	if (
		companion.accessControl === "PRIVATE" &&
		companion.owner !== ctx.userId
	) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "Companion is private",
		})
	}

	return companion
}
