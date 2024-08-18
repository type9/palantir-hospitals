"use client"


import { MidiPort } from "@/icons/MidiPort"
import { useExternalInput } from "@/liveinput/hooks/useExternalInput"
import styles from "./MidiInputSelector.module.css"

export type MidiInputSelectorProps = { initialSelectedInputIndex?: number }

export const MidiInputSelector = ({
	initialSelectedInputIndex,
}: MidiInputSelectorProps) => {
	const { inputStatuses } = useExternalInput()
	const hasConnection =
		inputStatuses.filter((status) => status.selected === true).length > 0

	return (
		<div className={styles.container}>
			<MidiPort
				fill={hasConnection ? "var(--accent-color-success)" : undefined}
				height="25px"
				width="25px"
			/>
			{/* <label htmlFor="midiInputSelector">Midi Input</label>
			<select id="midiInputSelector" name="midiInputSelector">
				{inputStatuses.map((inputStatus) => (
					<option key={inputStatus.id}>{inputStatus.label}</option>
				))}
			</select> */}
		</div>
	)
}
