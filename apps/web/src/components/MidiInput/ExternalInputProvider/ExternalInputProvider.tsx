"use client"

import { useMemo } from "react"

import {
	ExternalInputContext,
	ExternalInputContextType,
} from "@/liveinput/hooks/useExternalInput"
import { UseHistoricalInputBuffer } from "@/liveinput/hooks/useHistoricalInputBuffer"
import { useMidiInput } from "@/liveinput/hooks/useMidiInput"

export type ExternalInputProviderProps = { children: React.ReactNode }

export const ExternalInputProvider = ({
	children,
}: ExternalInputProviderProps) => {
	const { handleNoteOff, handleNoteOn, currentNotes, ...bufferState } =
		UseHistoricalInputBuffer()

	const { inputStatuses } = useMidiInput({
		initialSelectedInputIndex: 0,
		handleNoteOff,
		handleNoteOn,
	})

	const value: ExternalInputContextType = useMemo(
		() => ({
			...bufferState,
			handleNoteOff,
			handleNoteOn,
			inputStatuses,
			currentNotes,
		}),
		[bufferState, handleNoteOff, handleNoteOn, inputStatuses, currentNotes],
	)

	return (
		<ExternalInputContext.Provider value={value}>
			{children}
		</ExternalInputContext.Provider>
	)
}
