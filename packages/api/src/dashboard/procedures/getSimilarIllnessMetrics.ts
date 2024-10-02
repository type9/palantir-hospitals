import { COVID19TrackerSimilarDiagnosisViewFindManyArgsSchema } from "@colorchordsapp/db/zod"

import { publicProcedure } from "../../trpc"

// Function that triggers the patient data parse
export const getSimilarIllnessMetrics = publicProcedure
	.input(COVID19TrackerSimilarDiagnosisViewFindManyArgsSchema)
	.query(async ({ input, ctx }) => {
		return ctx.db.cOVID19TrackerSimilarDiagnosisView.findMany(input)
	})
