export const parseStringAsNumber = (
	str?: string | string[],
): number | undefined =>
	!Number.isNaN(Number(str)) //checks for undefined and NaN
		? Number(str)
		: undefined
