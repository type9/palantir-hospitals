// src/schemas/saveShape.ts
import { z } from "zod"

import { InputEntitySchema, InputEntityWithoutMetaSchema } from "./inputEntity"

// Define SaveShapeSchema
export const SaveTraySchema = z.object({
	savedShapes: z.array(InputEntitySchema),
})

// Define SerializableSaveShapeSchema where properties are optional
export const SerializableSaveTraySchema = SaveTraySchema.extend({
	savedShapes: z.array(InputEntityWithoutMetaSchema).optional(),
}).nullable()

// Create types
export type SaveTray = z.infer<typeof SaveTraySchema>
export type SerializableSavedShapes = z.infer<typeof SerializableSaveTraySchema>
