import { publicProcedure } from "../../trpc"
import {
	querySymptomsByIllness,
	QuerySymptomsByIllnessArgsSchema,
} from "../queries/querySymptomsByIllness"

// Function that triggers the patient data parse
export const getSymptomsByIllness = publicProcedure
	.input(QuerySymptomsByIllnessArgsSchema)
	.query(async ({ input, ctx }) => {
		return await querySymptomsByIllness({ ...input, ctx })
	})
