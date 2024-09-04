import { publicProcedure } from "../../trpc"
import { TriggerPatientDataParseSchema } from "../schemas/triggerParse"
import { batchParsePatientCaseData } from "../utils/batchParsePatientCaseData"
import { getNextPatientData } from "../utils/getNextPatientData"
import { retryWithCooldown } from "../utils/retryWithCooldown"

// Define the interval duration in milliseconds (e.g., 60000 for 1 minute)
const INTERVAL_DURATION = 60000 // adjust as needed
const RETRY_ATTEMPTS = 5 // maximum number of retry attempts
const COOLDOWN_DURATION = 5000 // cooldown duration in milliseconds (e.g., 5000 for 5 seconds)
const RECUR_INTERVAL = 1000 * 1 // 1 second

// Function that triggers the patient data parse
export const triggerPatientDataParse = publicProcedure
	.input(TriggerPatientDataParseSchema)
	.query(async ({ input, ctx }) => {
		// Function to perform the patient data parse logic
		const parsePatientData = async () => {
			const { reparseOptions } = input

			console.time("Fetched next batch to parse")
			const patientData = await getNextPatientData({
				...reparseOptions,
				ctx,
			})
			console.timeEnd("Fetched next batch to parse")

			if (!patientData || patientData.length === 0) {
				throw new Error("Error retrieving next parsable patient case")
			}

			const parsedDataIds = await batchParsePatientCaseData({
				rows: patientData,
				ctx,
			})

			return parsedDataIds
		}

		// Function to handle recurring execution
		const runWithRetryAndRecur = async () => {
			try {
				// Attempt the parsing with retries
				await retryWithCooldown(
					parsePatientData,
					RETRY_ATTEMPTS,
					COOLDOWN_DURATION,
				)
				console.log("Parse cycle completed successfully.")
			} catch (error) {
				console.error("Failed to parse after multiple attempts:", error)
			}

			// Schedule the next execution after the interval
			setTimeout(runWithRetryAndRecur, RECUR_INTERVAL)
		}

		// Start the recurring execution
		runWithRetryAndRecur()
	})
