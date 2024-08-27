import { publicProcedure } from "../../trpc"
import { TriggerPatientDataParseSchema } from "../schemas/triggerParse"
import { batchParsePatientCaseData } from "../utils/batchParsePatientCaseData"
import { getNextPatientData } from "../utils/getNextPatientData"
import { retryWithCooldown } from "../utils/retryWithCooldown"

export const triggerPatientDataParse = publicProcedure
	.input(TriggerPatientDataParseSchema)
	.query(async ({ input, ctx }) => {
		const { limit, reparseOptions } = input

		const patientData = await getNextPatientData({ ...reparseOptions, ctx })
		if (!patientData)
			throw new Error("Error retrieving next parsable patient case")

		const parsedDataId = await retryWithCooldown(
			async () => {
				return await batchParsePatientCaseData({
					rowData: patientData,
					ctx,
				})
			},
			3, // Number of retries
			10000, // Cooldown time in milliseconds (10 seconds)
		)

		return [parsedDataId]
	})
