import { publicProcedure } from "../../trpc"
import { createAnonymousUserSchema } from "../schemas/createAnonymousUser"
import { generateAnonymousUserId } from "../utils/anonymousUserUtils"

export const createAnonymousUser = publicProcedure
	.input(createAnonymousUserSchema)
	.mutation(async ({ input, ctx }) => {
		const user = ctx.db.anonymousUser.create({
			data: {
				id: generateAnonymousUserId(),
				expiresAt: input.expiresAt ?? null,
			},
		})

		return { user }
	})
