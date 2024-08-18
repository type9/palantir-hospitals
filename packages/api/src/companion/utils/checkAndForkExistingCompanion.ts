import { WithServerContext } from "../../trpc"
import { iterativelyGenerateUniqueShortId } from "./iterativelyGenerateUniqueShortId"
import { shouldForkCompanionData } from "./shouldForkCompanionData"

export const checkAndForkExistingCompanion = async ({
	remoteId,
	ctx,
}: WithServerContext<{ remoteId?: string }>) => {
	const existingCompanion = remoteId
		? await ctx.db.savedCompanion.findUnique({
				where: { shortId: remoteId },
			})
		: null

	const shouldFork = shouldForkCompanionData({
		existingCompanion: existingCompanion,
		userId: ctx.userId,
		anonymousUserId: ctx.anonymousUserId,
	})

	//naively assume the client providedId is the correctId
	let shortId = remoteId

	// if no companionId is provided, generate a new one
	if (!shortId) {
		shortId = await iterativelyGenerateUniqueShortId({
			maxRetries: 10,
			ctx,
		})
	}
	// if existing companion and shouldFork is true, generate a new one
	if (existingCompanion && shouldFork) {
		shortId = await iterativelyGenerateUniqueShortId({
			maxRetries: 10,
			ctx,
		})
	}
	// if a shortId was provided but it doens't already exist, generate a new one
	if (!existingCompanion && shortId) {
		shortId = await iterativelyGenerateUniqueShortId({
			maxRetries: 10,
			ctx,
		})
	}

	return {
		shortId,
		existingCompanion: existingCompanion ?? undefined,
	}
}
