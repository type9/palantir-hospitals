import { publicProcedure } from "../../trpc"
import {
	queryCasesAndKeywordInstancesByIds,
	QueryCasesAndKeywordInstancesByIdsArgsSchema,
} from "../queries/queryCaseIdsByUniqueKeywords"

// Function that triggers the patient data parse
export const getCasesAndKeywordInstancesByIds = publicProcedure
	.input(QueryCasesAndKeywordInstancesByIdsArgsSchema)
	.query(async ({ input, ctx }) => {
		return await queryCasesAndKeywordInstancesByIds({ ...input, ctx })
	})
