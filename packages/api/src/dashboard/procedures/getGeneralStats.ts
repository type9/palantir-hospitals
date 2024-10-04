import { COVID19GeneralStatisticsViewFindFirstArgsSchema } from "@colorchordsapp/db/zod"

import { publicProcedure } from "../../trpc"

// Function that triggers the patient data parse
export const getGeneralStats = publicProcedure
	.input(COVID19GeneralStatisticsViewFindFirstArgsSchema)
	.query(async ({ input, ctx }) => {
		return ctx.db.cOVID19GeneralStatisticsView.findFirst(input)
	})
