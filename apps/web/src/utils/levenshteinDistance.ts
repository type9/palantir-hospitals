import _ from "lodash"

export const levenshteinDistance = (a: string, b: string): number => {
	if (_.isEmpty(a)) return b.length
	if (_.isEmpty(b)) return a.length

	const matrix: (number | undefined)[][] = Array.from(
		{ length: b.length + 1 },
		() => Array.from({ length: a.length + 1 }, () => undefined),
	)

	matrix[0]![0] = 0
	for (let i = 1; i <= b.length; i++) {
		matrix[i]![0] = i
	}
	for (let j = 1; j <= a.length; j++) {
		matrix[0]![j] = j
	}

	for (let i = 1; i <= b.length; i++) {
		for (let j = 1; j <= a.length; j++) {
			const up = matrix[i - 1]![j] ?? Number.MAX_SAFE_INTEGER
			const left = matrix[i]![j - 1] ?? Number.MAX_SAFE_INTEGER
			const diag = matrix[i - 1]![j - 1] ?? Number.MAX_SAFE_INTEGER
			const cost = b.charAt(i - 1) === a.charAt(j - 1) ? 0 : 1
			matrix[i]![j] = Math.min(diag + cost, up + 1, left + 1)
		}
	}

	return matrix[b.length]![a.length] ?? Number.MAX_SAFE_INTEGER // Fallback for undefined
}

//returns a number between 0 and 1, where 0 is fully similar and 1 is not similar at all
export const getSearchStringSimilarityScore = (
	searchTerm: string,
	compareTerm: string,
): number => {
	const distance = levenshteinDistance(searchTerm, compareTerm)
	const maxLength = Math.max(searchTerm.length, compareTerm.length)
	return 1 - distance / maxLength
}
