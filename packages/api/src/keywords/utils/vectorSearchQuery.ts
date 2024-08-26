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

export const toVectorString = (vector: number[]): string => {
	return `[${vector.join(",")}]::vector`
}

export const parseVector = (vectorString: string): number[] =>
	vectorString.slice(1, -1).split(",").map(Number)

type TableNameToModelType = {
	KeywordInstance: KeywordInstance
	KeywordInstanceGroup: KeywordInstanceGroup
	UniqueKeyword: UniqueKeyword
}

type QueryByVectorReturnType<T extends KEYWORD_VECTOR_TABLE> =
	TableNameToModelType[T]

export const formatVector = (vector: number[]): string => {
	return `[${vector.join(", ")}]`
}

// Generic raw query function with return type based on the table name
const queryByVector = async <T extends KEYWORD_VECTOR_TABLE>({
	table,
	vector,
	topK = 10,
	ctx,
}: KeywordVectorQueryParams & { table: T }): Promise<
	QueryByVectorReturnType<T>[]
> => {
	const formattedVector = formatVector(vector)
	const results = await ctx.db.$queryRaw<QueryByVectorReturnType<T>[]>`
    SELECT 
      id, 
      "semanticName", 
      category, 
      vector::text 
    FROM ${Prisma.raw(`"${table}"`)}
    ORDER BY vector <-> ${Prisma.raw(`'${formattedVector}'::vector`)}
    LIMIT ${topK};
  `

	// Parse the vector field from string back to number[]
	const parsedResults = results.map((result) => ({
		...result,
		vector: parseVector(result.vector as unknown as string),
	}))

	return parsedResults
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
