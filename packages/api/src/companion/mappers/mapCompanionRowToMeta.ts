import { CompanionMeta } from "../schemas/companionMeta"
import { validateAccessAndGetCompanion } from "../utils/validateAccessAndGetCompanion"

export const mapCompanionRowToMeta = (
	data: Awaited<ReturnType<typeof validateAccessAndGetCompanion>>,
): CompanionMeta => {
	return {
		shortId: data.shortId,
		accessControl: data.accessControl,
		ownerUsername: data.user?.username,
		name: data.name,
		description: data.description,
	}
}
