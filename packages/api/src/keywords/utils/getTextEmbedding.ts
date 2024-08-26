import { openai } from "../../openai"

export const DEFAULT_MODEL = "text-embedding-3-small"

export const EMBEDDING_DIMENSIONS = 1536

export const getTextEmbedding = async ({
	text,
	model = DEFAULT_MODEL,
}: {
	text: string
	model?: string
}) => {
	const response = await openai.embeddings.create({
		model, // Using the recommended embedding model
		input: text,
		dimensions: EMBEDDING_DIMENSIONS,
		encoding_format: "float",
	})

	const embedding = response.data[0]?.embedding

	if (!embedding) throw new Error("Failed to get embedding")

	// Return the embedding vector
	return { text, embedding }
}
