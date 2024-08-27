import {
	createDefaultId,
	KeywordInstance,
	KeywordInstanceGroup,
	UniqueKeyword,
} from "@colorchordsapp/db"

import { WithRelatedPatientCase } from "../../patientData/schemas/patientCaseContext"
import { formatVector, parseVector } from "./vectorSearchQuery"

export type KEYWORD_VECTOR_TABLE =
	| "KeywordInstance"
	| "KeywordInstanceGroup"
	| "UniqueKeyword"

export type KeywordVectorInsertParams<T extends KEYWORD_VECTOR_TABLE> =
	WithRelatedPatientCase<{
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
	const vectorString = formatVector(data.vector)
	const id = data.id ?? createDefaultId()

	const embeddedData = { id, ...data }

	// Create a parameterized query with the formatted vector string
	const keys = Object.keys(embeddedData)
		.map((key) => `"${key}"`)
		.join(", ")

	const values = Object.keys(embeddedData)
		.map(
			(key) =>
				key === "vector"
					? `$1::vector`
					: `'${embeddedData[key as keyof typeof embeddedData]}'`, // Use embeddedData here
		)
		.join(", ")

	// Modify the query to cast the vector to a string
	const query = `
      INSERT INTO "${table}" 
      (${keys}) 
      VALUES (${values}) 
      RETURNING "id", "semanticName", "category", vector::text
  `

	let result = await tx.$queryRawUnsafe<Array<InsertReturnType<T>>>(
		query,
		vectorString,
	)

	if (!result?.[0])
		throw new Error(
			`Failed to insert keyword with vector table "${table}", ${keys}: ${values}`,
		)

	// Parse the vector field from string back to number[]
	const parsedResult = {
		...result?.[0],
		vector: result?.[0]?.vector
			? parseVector(result[0].vector as unknown as string)
			: ([] as number[]),
	} as InsertReturnType<T> // Cast the result to the correct type

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
