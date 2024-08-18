import { useState, useEffect } from "react"

export const useStrictModeDroppable = () => {
	const [enabled, setEnabled] = useState(false)

	useEffect(() => {
		const animation = requestAnimationFrame(() => setEnabled(true))

		return () => {
			cancelAnimationFrame(animation)
			setEnabled(false)
		}
	}, [])

	return enabled
}
