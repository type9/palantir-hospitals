"use client"

import { Button } from "@/components/ui/button"
import { api } from "@/trpc/APIProvider"

export const TriggerPatientDataParseButton = () => {
	const { data, isLoading, refetch, error } =
		api.patientDataRouter.triggerPatientDataParse.useQuery(
			{ reparseOptions: { limit: 10 } },
			{ enabled: false, retry: false, refetchOnMount: false },
		)

	// Handle button click to manually trigger the query
	const handleClick = async () => {
		try {
			await refetch() // Manually trigger the query
		} catch (err) {
			console.error("Error triggering data parse:", err)
		}
	}

	console.log(data, isLoading, error)
	return (
		<Button onClick={handleClick} disabled={isLoading}>
			{isLoading ? "Processing..." : "Trigger Data Parse"}
		</Button>
	)
}
