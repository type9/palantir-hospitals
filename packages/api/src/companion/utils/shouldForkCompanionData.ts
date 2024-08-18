import { SavedCompanion } from "@colorchordsapp/db"

export const shouldForkCompanionData = ({
	userId,
	anonymousUserId,
	existingCompanion,
}: {
	userId: string | null
	anonymousUserId: string | null
	existingCompanion: Partial<SavedCompanion> | null
}): boolean => {
	// If the companion doesn't exist, we don't need to fork it
	if (!existingCompanion) {
		return false
	}

	// If the companion is owned by the user, we don't need to fork it
	if (existingCompanion.owner === userId) {
		return false
	}

	//if the anonymous owner is the same as the current anonymous user, we don't need to fork it
	if (existingCompanion.anonymousOwner == anonymousUserId) {
		return false
	}

	return true
}
