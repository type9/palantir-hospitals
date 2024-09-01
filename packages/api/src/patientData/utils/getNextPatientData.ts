import { WithServerContext } from "../../trpc"
import type { GetNextPatientDataArgs } from "../schemas/getNextPatientData"

export const getNextPatientData = async ({
	limit = 10,
	reparseLtDate,
	ctx,
}: WithServerContext<GetNextPatientDataArgs>) => {
	console.log(`Fetching batch of patient data to parse LIMIT:${limit}`)

	const nextPatientData = await ctx.db.patientCaseData.findMany({
		where: reparseLtDate // if reparseLtDate is provided, return the next patient data that was parsed before that date. if not any that has not been parsed yet
			? { parsedAt: { lt: new Date(reparseLtDate) } }
			: { parsedAt: { equals: null } },
		take: limit,
		orderBy: {
			parsedAt: "asc",
		},
	})

	return nextPatientData
}
