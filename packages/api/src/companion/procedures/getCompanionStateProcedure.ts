import { TRPCError } from "@trpc/server"

import { publicProcedure } from "../../trpc"
import { mapCompanionRowToState } from "../mappers/mapCompanionRowToState"
import { GetRemoteCompanionStateInputSchema } from "../schemas/RemoteState"
import { validateAccessAndGetCompanion } from "../utils/validateAccessAndGetCompanion"

export const getCompanionStateProcedure = publicProcedure
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

		return mapCompanionRowToState(companion)
	})
