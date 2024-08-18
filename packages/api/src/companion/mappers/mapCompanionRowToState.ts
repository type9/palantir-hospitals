import { SavedCompanion } from "@colorchordsapp/db"

import {
	SerializableCompanionConfigurationSchema,
	SerializableCompanionState,
	SerializableSaveTraySchema,
} from "../schemas"

export const mapCompanionRowToState = (
	data: SavedCompanion,
): { initialState: SerializableCompanionState; remoteId: string } => {
	return {
		initialState: {
			configuration: SerializableCompanionConfigurationSchema.parse(
				data.savedConfiguration,
			),
			saveTray: SerializableSaveTraySchema.parse({
				savedShapes: data.savedInputs
					? JSON.parse(data.savedInputs as string)
					: undefined,
			}),
		},
		remoteId: data.shortId,
	}
}
