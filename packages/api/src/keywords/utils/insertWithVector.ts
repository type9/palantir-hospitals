import {
	createDefaultId,
	KeywordInstance,
	KeywordInstanceGroup,
	Prisma,
	UniqueKeyword,
} from "@colorchordsapp/db"

import { WithRelatedPatientCase } from "../../patientData/schemas/patientCaseContext"
import { WithTransactionContext } from "../../trpc"
import { formatVector, parseVector } from "./vectorSearchQuery"

export type KEYWORD_VECTOR_TABLE =
	| "KeywordInstance"
	| "KeywordInstanceGroup"
	| "UniqueKeyword"

export type KeywordVectorInsertParams<T extends KEYWORD_VECTOR_TABLE> =
	WithTransactionContext<{
		table: T
		data: {
			id?: string
			semanticName?: string
			category?: string
			vector: number[]
			// Add any additional fields that are required for each table
		}
	}>

type TableNameToModelType = {
	KeywordInstance: KeywordInstance
	KeywordInstanceGroup: KeywordInstanceGroup
	UniqueKeyword: UniqueKeyword
}

type InsertReturnType<T extends KEYWORD_VECTOR_TABLE> = TableNameToModelType[T]

// Generic raw insert function
export const insertWithVector = async <T extends KEYWORD_VECTOR_TABLE>({
	table,
	data,
	tx,
}: KeywordVectorInsertParams<T>): Promise<InsertReturnType<T>> => {
	const vectorString = formatVector(data.vector) // Convert vector to string format
	const id = data.id ?? createDefaultId() // Generate a new id if not provided

	// Prepare data for the parameterized query
	const embeddedData = { id, ...data }

	// Construct the SQL query using Prisma's SQL template literals
	const result = await tx.$queryRaw<Array<InsertReturnType<T>>>`
	  INSERT INTO ${Prisma.raw(`"${table}"`)} 
	  ("id", "category", "semanticName", "vector")
	  VALUES (
		${id}, 
		${embeddedData.category}::"KeywordCategory",
		${embeddedData.semanticName}, 
		${Prisma.raw(`'${vectorString}'::vector`)}
	  )
	  RETURNING "id", "semanticName", "category";
	`

	if (!result?.[0]) {
		throw new Error(
			`Failed to insert keyword with vector into table "${table}", data: ${JSON.stringify(data)}`,
		)
	}

	// Parse the vector field from string back to number[]
	const parsedResult = {
		...result[0],
	} as InsertReturnType<T>

	return parsedResult
}

export const insertKeywordInstanceWithVector = async (
	params: Omit<KeywordVectorInsertParams<"KeywordInstance">, "table">,
) => {
	return await insertWithVector({ ...params, table: "KeywordInstance" })
}

export const insertKeywordInstanceGroupWithVector = async (
	params: Omit<KeywordVectorInsertParams<"KeywordInstanceGroup">, "table">,
) => {
	return await insertWithVector({ ...params, table: "KeywordInstanceGroup" })
}

export const insertUniqueKeywordWithVector = async (
	params: Omit<KeywordVectorInsertParams<"UniqueKeyword">, "table">,
) => {
	return await insertWithVector({ ...params, table: "UniqueKeyword" })
}
