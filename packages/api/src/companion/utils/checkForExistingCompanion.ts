import { WithServerContext } from "../../trpc"

export const checkForExistingCompanion = async ({
	shortId,
	ctx,
}: WithServerContext<{
	shortId: string
}>) => {
	const companion = await ctx.db.savedCompanion.findUnique({
		where: { shortId },
		select: { shortId: true, owner: true, accessControl: true },
	})

	return companion
}
