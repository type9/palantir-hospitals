import { publicProcedure } from "../../trpc"
import { TriggerPatientDataParseSchema } from "../schemas/triggerParse"
import { batchParsePatientCaseData } from "../utils/batchParsePatientCaseData"
import { getNextPatientData } from "../utils/getNextPatientData"
import { retryWithCooldown } from "../utils/retryWithCooldown"

export const triggerPatientDataParse = publicProcedure
	.input(TriggerPatientDataParseSchema)
	.query(async ({ input, ctx }) => {
		const { reparseOptions } = input

		const patientData = await getNextPatientData({ ...reparseOptions, ctx })
		if (!patientData)
			throw new Error("Error retrieving next parsable patient case")

		const parsedDataIds = await batchParsePatientCaseData({
			rows: patientData,
			ctx,
		})

		return parsedDataIds
	})
