import { publicProcedure } from "../../trpc"
import { TriggerPatientDataParseSchema } from "../schemas/triggerParse"
import { getNextPatientData } from "../utils/getNextPatientData"
import { parsePatientCaseData } from "../utils/parsePatientData"

export const triggerPatientDataParse = publicProcedure
	.input(TriggerPatientDataParseSchema)
	.query(async ({ input, ctx }) => {
		const { limit, reparseOptions } = input

		const patientData = await getNextPatientData({ ...reparseOptions, ctx })
		if (!patientData)
			throw new Error("Error retrieving next parsable patient case")

		const parsedDataId = await parsePatientCaseData({
			rowData: patientData,
			ctx,
		})

		return [parsedDataId]
	})
