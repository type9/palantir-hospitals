import { WithServerContext } from "../../trpc"
import type { GetNextPatientDataArgs } from "../schemas/getNextPatientData"

export const getNextPatientData = async ({
	limit,
	reparseLtDate,
	ctx,
}: WithServerContext<GetNextPatientDataArgs>) => {
	const nextPatientData = await ctx.db.patientCaseData.findMany({
		where: reparseLtDate // if reparseLtDate is provided, return the next patient data that was parsed before that date. if not any that has not been parsed yet
			? { parsedAt: { lt: new Date(reparseLtDate) } }
			: { parsedAt: { equals: null } },
		take: limit,
		orderBy: {
			id: "asc",
		},
	})

	return nextPatientData
}
