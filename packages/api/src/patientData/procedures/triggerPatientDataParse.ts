import { publicProcedure } from "../../trpc"
import { TriggerPatientDataParseSchema } from "../schemas/triggerParse"
import { batchParsePatientCaseData } from "../utils/batchParsePatientCaseData"
import { getNextPatientData } from "../utils/getNextPatientData"

export const triggerPatientDataParse = publicProcedure
	.input(TriggerPatientDataParseSchema)
	.query(async ({ input, ctx }) => {
		const { reparseOptions } = input

		console.time("Fetched next batch to parse")
		const patientData = await getNextPatientData({ ...reparseOptions, ctx })
		console.timeEnd("Fetched next batch to parse")

		if (!patientData || patientData.length === 0)
			throw new Error("Error retrieving next parsable patient case")

		const parsedDataIds = await batchParsePatientCaseData({
			rows: patientData,
			ctx,
		})

		return parsedDataIds
	})
