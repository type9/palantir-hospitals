import { publicProcedure } from "../../trpc"
import { getNextPatientDataSchema } from "../schemas/getNextPatientData"

export const getNextPatientData = publicProcedure
	.input(getNextPatientDataSchema)
	.query(async ({ input, ctx }) => {
		const { reparseLtDate } = input

		const nextPatientData = await ctx.db.patientCaseData.findFirst({
			where: reparseLtDate // if reparseLtDate is provided, return the next patient data that was parsed before that date. if not any that has not been parsed yet
				? { parsedAt: { lt: new Date(reparseLtDate) } }
				: { parsedAt: { equals: null } },
			orderBy: {
				id: "asc",
			},
		})

		return nextPatientData
	})
