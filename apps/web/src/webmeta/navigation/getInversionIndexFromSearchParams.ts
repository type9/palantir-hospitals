export const getNumberFromUnknownString = (param?: string | null) =>
	isNaN(Number(param)) ? 0 : Number(param)
