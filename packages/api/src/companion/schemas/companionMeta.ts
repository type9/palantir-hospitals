import { SavedCompanionSchema, UserSchema } from "@colorchordsapp/db/zod"
import { z } from "zod"

export const CompanionAccessMetaSchema = z.object({
	accessControl: SavedCompanionSchema.shape.accessControl,
})

export const CompanionDisplayMetaSchema = z.object({
	name: SavedCompanionSchema.shape.name.optional(),
	description: SavedCompanionSchema.shape.description.optional(),
})
export const SetCompanionDisplayMetaSchema = CompanionDisplayMetaSchema.extend({
	remoteId: SavedCompanionSchema.shape.shortId.optional(),
})

export const CompanionMetaSchema = z
	.object({
		shortId: SavedCompanionSchema.shape.shortId,
		ownerUsername: UserSchema.shape.username.optional(),
	})
	.extend(CompanionAccessMetaSchema.shape)
	.extend(CompanionDisplayMetaSchema.shape)

export type CompanionUserMetaSchema = z.infer<typeof CompanionAccessMetaSchema>

export type CompanionDisplayMetaSchema = z.infer<
	typeof CompanionDisplayMetaSchema
>
export type SetCompanionDisplayMetaArgs = z.infer<
	typeof SetCompanionDisplayMetaSchema
>

export type CompanionMeta = z.infer<typeof CompanionMetaSchema>
