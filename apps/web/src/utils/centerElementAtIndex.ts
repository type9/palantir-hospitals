export const centerElementAtIndex = <T>(arr: T[], index: number): T[] => {
	if (arr.length <= 1 || index === Math.floor(arr.length / 2)) {
		return arr // No rotation needed if array has 0 or 1 element, or element is already centered
	}

	// Determine center position for odd and even lengths
	const center = Math.floor((arr.length - 1) / 2)

	// Calculate the number of positions to rotate
	// For even-sized arrays, this will place the index just to the right of center
	const positionsToRotate = (arr.length + center - index) % arr.length

	// Rotate the array to center the element at the specified index
	return [
		...arr.slice(-positionsToRotate),
		...arr.slice(0, arr.length - positionsToRotate),
	]
}
