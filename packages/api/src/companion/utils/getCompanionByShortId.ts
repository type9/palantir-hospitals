import { WithServerContext } from "../../trpc"

export const getCompanionByShortId = async ({
	shortId,
	ctx,
}: WithServerContext<{
	shortId: string
}>) => {
	const companion = await ctx.db.savedCompanion.findUnique({
		where: { shortId },
	})

	return companion
}
