import { SHORT_ID_LENGTH } from "@/constants/Globals"

// Assuming short IDs are alphanumeric and a minimum length
export const isLastSegmentAShortId = (
	pathname: string | null,
	length: number = SHORT_ID_LENGTH,
) => {
	if (!pathname) return false
	const segments = pathname.split("/")
	const lastSegment = segments.pop()

	if (!lastSegment || !(segments.length >= 2)) return false
	// Check if the last segment exists and meets the basic criteria for a short ID
	return (
		Boolean(lastSegment) &&
		lastSegment.length === length &&
		/^[A-Za-z0-9_-]*$/.test(lastSegment)
	)
}
