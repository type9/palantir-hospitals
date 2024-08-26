import { KeywordCategory } from "@colorchordsapp/db"

export const KEYWORD_SIMILARITY_THRESHOLD = 0.9

function cosineSimilarity(vectorA: number[], vectorB: number[]): number {
	if (vectorA.length !== vectorB.length)
		throw new Error(
			`Vectors must be of same length ${vectorA.length} !== ${vectorB.length}`,
		)

	const dotProduct = vectorA.reduce((sum, a, i) => {
		const b = vectorB[i]
		if (b === undefined) {
			throw new Error(`Index ${i} is out of bounds for vectorB`)
		}
		return sum + a * b
	}, 0)

	const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0))
	const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0))

	if (magnitudeA === 0 || magnitudeB === 0)
		throw new Error(
			"Magnitude of one of the vectors is zero, cannot compute cosine similarity",
		)

	return dotProduct / (magnitudeA * magnitudeB)
}

export const shouldMergeVectors = (
	vectorA: number[],
	vectorB: number[],
	threshold: number = KEYWORD_SIMILARITY_THRESHOLD,
): boolean => cosineSimilarity(vectorA, vectorB) >= threshold

export const isObviouslySameKeyword = ({
	keywordA,
	keywordB,
}: {
	keywordA: { semanticName: string; category: KeywordCategory }
	keywordB: { semanticName: string; category: KeywordCategory }
}): boolean =>
	keywordA.category.toLowerCase() !== keywordB.category.toLowerCase() &&
	keywordA.semanticName.toLowerCase() !== keywordB.semanticName.toLowerCase()

export const getKeywordSimilarity = ({
	keywordA,
	keywordB,
}: {
	keywordA: {
		semanticName: string
		embedding: number[]
		category: KeywordCategory
	}
	keywordB: {
		semanticName: string
		embedding: number[]
		category: KeywordCategory
	}
}): number => {
	console.log(
		keywordA.semanticName,
		keywordB.semanticName,
		cosineSimilarity(keywordA.embedding, keywordB.embedding),
	)
	if (isObviouslySameKeyword({ keywordA, keywordB })) return 1
	return cosineSimilarity(keywordA.embedding, keywordB.embedding)
}
