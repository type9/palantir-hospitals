import { TRPCError } from "@trpc/server"

import { publicProcedure } from "../../trpc"
import { mapCompanionRowToMeta } from "../mappers/mapCompanionRowToMeta"
import { GetRemoteCompanionStateInputSchema } from "../schemas"
import { validateAccessAndGetCompanion } from "../utils/validateAccessAndGetCompanion"

export const getCompanionMetaProcedure = publicProcedure
	.input(GetRemoteCompanionStateInputSchema)
	.query(async ({ input, ctx }) => {
		const { remoteId } = input

		if (!remoteId) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "remoteId is required",
			})
		}

		const companion = await validateAccessAndGetCompanion({ ctx, remoteId })
		return mapCompanionRowToMeta(companion)
	})
