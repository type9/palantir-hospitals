import { COVID19TrackerSymptomViewFindManyArgsSchema } from "@colorchordsapp/db/zod"

import { publicProcedure } from "../../trpc"

// Function that triggers the patient data parse
export const getSymptomMetrics = publicProcedure
	.input(COVID19TrackerSymptomViewFindManyArgsSchema)
	.query(async ({ input, ctx }) => {
		return ctx.db.cOVID19TrackerSymptomView.findMany(input)
	})
