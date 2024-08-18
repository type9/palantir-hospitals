import { TRPCError } from "@trpc/server"

import { WithServerContext } from "../../trpc"
import { checkForExistingCompanion } from "./checkForExistingCompanion"
import { generateShortId } from "./generateShortId"

export const iterativelyGenerateUniqueShortId = async ({
	maxRetries,
	ctx,
}: WithServerContext<{
	maxRetries: number
}>): Promise<string> => {
	let unique = false
	let remoteShortId
	let retries = 0
	while (!unique || retries < maxRetries) {
		remoteShortId = generateShortId()
		const exists = await checkForExistingCompanion({
			shortId: remoteShortId,
			ctx,
		})
		unique = !exists
		retries += 1
	}

	if (!remoteShortId) {
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Failed to generate unique shortId",
		})
	}

	return remoteShortId
}
