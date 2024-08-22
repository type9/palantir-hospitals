import {
	KeywordInstance,
	KeywordInstanceGroup,
	Prisma,
	UniqueKeyword,
} from "@colorchordsapp/db"

import { WithServerContext } from "../../trpc"
import { VectorSearchInput } from "../schema/keywordVector"

export type KEYWORD_VECTOR_TABLE =
	| "KeywordInstance"
	| "KeywordInstanceGroup"
	| "UniqueKeyword"

export type KeywordVectorQueryParams = WithServerContext<VectorSearchInput>

type TableNameToModelType = {
	KeywordInstance: KeywordInstance
	KeywordInstanceGroup: KeywordInstanceGroup
	UniqueKeyword: UniqueKeyword
}

type QueryByVectorReturnType<T extends KEYWORD_VECTOR_TABLE> =
	TableNameToModelType[T][]

// Generic raw query function with return type based on the table name
const queryByVector = async <T extends KEYWORD_VECTOR_TABLE>({
	table,
	vector,
	topK = 10,
	ctx,
}: KeywordVectorQueryParams & { table: T }): Promise<
	QueryByVectorReturnType<T>
> => {
	const results = await ctx.db.$queryRaw<QueryByVectorReturnType<T>>`
    SELECT *
    FROM ${Prisma.raw(table)}
    ORDER BY vector <-> ${vector}::vector
    LIMIT ${topK};
  `
	return results
}

export const queryKeywordInstanceByVector = async (
	params: KeywordVectorQueryParams,
) => await queryByVector({ ...params, table: "KeywordInstance" })

export const queryKeywordInstanceGroupByVector = async (
	params: KeywordVectorQueryParams,
) => await queryByVector({ ...params, table: "KeywordInstanceGroup" })

export const queryUniqueKeywordByVector = async (
	params: KeywordVectorQueryParams,
) => await queryByVector({ ...params, table: "UniqueKeyword" })
