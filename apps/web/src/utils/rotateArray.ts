//from https://stackoverflow.com/questions/74312619/rotating-an-array-according-to-user-input
export const rotateArray = (arr: any[], p: number, direction?: "left") => {
	if (direction === "left")
		return [...arr.slice(-1 * p), ...arr.slice(0, arr.length - p)]
	else return [...arr.slice(p), ...arr.slice(0, p)]
}
