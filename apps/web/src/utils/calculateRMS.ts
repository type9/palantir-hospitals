export const calculateRootMeanSquared = (values: number[]) =>
	Math.sqrt(
		values.map((val) => val * val).reduce((acum, val) => acum + val) /
			values.length,
	)
