import { useState, useEffect, RefObject } from "react"
import { debounce } from "lodash" // Import debounce from lodash

export type ComponentSize = {
	width: number
	height: number
}
// Custom hook that wraps useComponentSize and adds debouncing
export const useDebouncedComponentSize = <T extends HTMLElement>(
	ref: RefObject<T>,
	delay: number = 100,
): ComponentSize => {
	// Initial state is set to 0 for both width and height
	const [size, setSize] = useState<ComponentSize>({ width: 0, height: 0 })

	useEffect(() => {
		// Ensure the element exists and has been mounted
		if (ref.current) {
			// Update the size state with the current dimensions of the ref
			const updateSize = () => {
				setSize({
					width: ref?.current?.offsetWidth ?? 0,
					height: ref?.current?.offsetHeight ?? 0,
				})
			}

			// Debounce the updateSize function
			const debouncedUpdateSize = debounce(updateSize, delay)

			// Call the debounced function once to set the initial size
			debouncedUpdateSize()

			// Set up the event listener for window resize
			window.addEventListener("resize", debouncedUpdateSize)

			// Clean up the event listener on component unmount
			return () => {
				window.removeEventListener("resize", debouncedUpdateSize)
				debouncedUpdateSize.cancel() // Cancel any pending debounced calls
			}
		}
	}, [ref, delay]) // Rerun only if ref or delay changes

	return size
}
