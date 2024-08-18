import { UserJSON, WebhookEvent } from "@clerk/nextjs/server"
import { TRPCError } from "@trpc/server"
import { Webhook } from "svix"

import { publicProcedure } from "../../trpc"
import { handleClerkWebhookInputSchema } from "../schemas/handleClerkWebhookInputSchema"
import { mapClerkUserJsonToRowData } from "../utils/mapClerkUserToRowData"

export const syncClerkUsersProcedure = publicProcedure
	.input(handleClerkWebhookInputSchema)
	.mutation(async ({ input, ctx }) => {
		const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET
		if (!WEBHOOK_SECRET) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Missing WEBHOOK_SECRET from environment",
			})
		}

		const { body, svixId, svixTimestamp, svixSignature } = input

		const wh = new Webhook(WEBHOOK_SECRET)
		let evt: WebhookEvent

		try {
			evt = wh.verify(body, {
				"svix-id": svixId,
				"svix-timestamp": svixTimestamp,
				"svix-signature": svixSignature,
			}) as WebhookEvent
		} catch (err) {
			console.error("Error verifying webhook:", err)
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "Invalid webhook signature",
			})
		}

		const eventType = evt.type
		const data = evt.data as UserJSON

		if (eventType === "user.deleted") {
			await ctx.db.user.deleteMany({
				where: { clerkId: data.id },
			})
		} else {
			const userData = mapClerkUserJsonToRowData(data)

			if (eventType === "user.created") {
				await ctx.db.user.create({
					data: userData,
				})
			} else if (eventType === "user.updated") {
				await ctx.db.user.upsert({
					where: { clerkId: data.id },
					update: userData,
					create: userData,
				})
			}
		}

		return { success: true }
	})
