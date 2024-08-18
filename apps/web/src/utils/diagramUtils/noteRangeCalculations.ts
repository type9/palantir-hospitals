import { MAX_NOTES } from "@/musictheory/notes/constants"

export type DiagramBounds = {
	lowerBound: number
	upperBound: number
}

export type BoundsCalculationParams = {
	activeNotesLowerbound: number
	activeNotesUpperbound: number
	fillIncompleteOctaves?: boolean
	padding?: number // in terms of number of notes
}

/**
 * Calculates the adjusted bounds to ensure they fill complete octaves if required,
 * and applies minimum padding to both sides of the range.
 */
export const calculateDiagramBounds = ({
	activeNotesLowerbound,
	activeNotesUpperbound,
	fillIncompleteOctaves,
	padding = 0,
}: BoundsCalculationParams): DiagramBounds => {
	let diagramLowerbound: number
	let diagramUpperbound: number

	if (fillIncompleteOctaves) {
		// Adjust lower bound downward to the nearest multiple of MAX_NOTES, with padding
		diagramLowerbound =
			Math.floor((activeNotesLowerbound - padding) / MAX_NOTES) *
			MAX_NOTES
		// Adjust upper bound upward to the nearest multiple of MAX_NOTES, with padding
		diagramUpperbound =
			Math.ceil((activeNotesUpperbound + padding) / MAX_NOTES) *
				MAX_NOTES -
			1
	} else {
		// Apply padding without altering bounds to complete octaves
		diagramLowerbound = activeNotesLowerbound - padding
		diagramUpperbound = activeNotesUpperbound + padding
	}

	// Ensure lower bound does not go below zero
	diagramLowerbound = Math.max(0, diagramLowerbound)

	return {
		lowerBound: diagramLowerbound,
		upperBound: diagramUpperbound,
	}
}
