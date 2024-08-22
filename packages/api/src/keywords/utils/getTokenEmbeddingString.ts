import { getTextEmbedding } from "./getTextEmbedding"

export const formatTokenEmbeddingString = ({
	token,
	tokenCategory,
}: {
	token: string
	tokenCategory: string
}) => `${tokenCategory} - ${token}`

export const getUniqueTokenEmbedding = ({
	token,
	tokenCategory,
}: {
	token: string
	tokenCategory: string
}) =>
	getTextEmbedding({
		text: formatTokenEmbeddingString({ token, tokenCategory }),
	})
