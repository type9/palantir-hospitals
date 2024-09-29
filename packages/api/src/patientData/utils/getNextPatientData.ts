import { WithServerContext } from "../../trpc"
import type { GetNextPatientDataArgs } from "../schemas/getNextPatientData"

export const getNextPatientData = async ({
	limit = 20,
	reparseLtDate,
	ctx,
}: WithServerContext<GetNextPatientDataArgs>) => {
	console.log(`Fetching batch of patient data to parse LIMIT:${limit}`)

	const nextPatientData = await ctx.db.patientCaseData.findMany({
		where: {
			shouldParse: true, // added in reference to a new requirement to filter by relevant data
			...(reparseLtDate
				? { parsedAt: { lt: new Date(reparseLtDate) } }
				: { parsedAt: { equals: null } }),
		},
		take: limit,
		orderBy: {
			parsedAt: "asc",
		},
	})

	return nextPatientData
}
