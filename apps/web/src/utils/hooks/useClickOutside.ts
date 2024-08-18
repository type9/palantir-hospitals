import { useEffect, useRef, RefObject } from "react"

// The hook accepts a callback function and returns a ref object.
// The callback will be called when a click outside the element attached to the ref occurs.
export const useClickOutside = <T extends HTMLElement>(
	onClickOutside: (event: MouseEvent) => void,
): { ref: RefObject<T> } => {
	const ref = useRef<T>(null)

	const handleClickOutside = (event: MouseEvent) => {
		if (ref.current && !ref.current.contains(event.target as Node)) {
			onClickOutside(event)
		}
	}

	useEffect(() => {
		// Bind the event listener for the document click event
		document.addEventListener("mousedown", handleClickOutside)

		// Clean up the event listeners on component unmount
		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, []) // Empty dependency array means this effect will only run on mount and unmount

	return { ref }
}
