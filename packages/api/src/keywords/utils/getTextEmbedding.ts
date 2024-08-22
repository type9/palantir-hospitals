import { openai } from "../../openai"

export const DEFAULT_MODEL = "text-embedding-ada-002"

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
	})

	const embedding = response.data[0]?.embedding

	if (!embedding) throw new Error("Failed to get embedding")

	// Return the embedding vector
	return { text, embedding }
}
