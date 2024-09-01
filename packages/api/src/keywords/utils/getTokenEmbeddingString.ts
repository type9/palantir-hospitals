import {
	formatKeywordCategory,
	formatKeywordSemanticName,
} from "./formatKeyword"
import { getTextEmbedding } from "./getTextEmbedding"

export const formatTokenEmbeddingString = ({
	token,
	tokenCategory,
}: {
	token: string
	tokenCategory: string
}) =>
	`${formatKeywordCategory(tokenCategory)} ${formatKeywordSemanticName(token)}`

export const getKeywordIndexString = ({
	semanticName,
	category,
}: {
	semanticName: string
	category: string
}) =>
	formatTokenEmbeddingString({ token: semanticName, tokenCategory: category })

export const getUniqueTokenEmbedding = ({
	semanticName,
	category,
}: {
	semanticName: string
	category: string
}) =>
	getTextEmbedding({
		text: formatTokenEmbeddingString({
			token: semanticName,
			tokenCategory: category,
		}),
	})
