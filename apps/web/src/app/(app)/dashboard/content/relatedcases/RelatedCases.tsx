"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/trpc/APIProvider"

export const RelatedCasesTab: React.FC = ({}) => {
	const [prompt, setPrompt] = useState<string>("")
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

	return (
		<div>
			<div className="min-h-sm grid w-full gap-1.5">
				<Label htmlFor="prompt">Explore existing cases</Label>
				<Textarea
					id="prompt"
					placeholder={
						"Describe symptoms, possible illness, consider solutions..."
					}
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
				/>
				<Button
					onClick={handleClick}
					className="w-24"
					disabled={isLoading}
				>
					Start search
				</Button>
			</div>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"></div>
		</div>
	)
}
