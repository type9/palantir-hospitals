import _ from "lodash"

export type DataPoint = {
	x: number
	y: number
}

export type RegressionLine = {
	slope: number
	intercept: number
	xRange: [number, number]
	metric: number // Example metric could be R^2, the closer to 1, the better
}

export type RegressionResult = {
	slope: number
	intercept: number
	rSquared: number
}

export type PartitionResult = {
	regressionLine: RegressionLine
	rSquared: number
	datapoints: DataPoint[]
}

export type MinimumPartitionArgs = {
	datapoints: DataPoint[]
	minRSquared: number
	minimumDatapoints?: number
}

/**
 * Recursively generates partitions of data into k contiguous segments, respecting minimum datapoints requirement.
 */
const generatePartitions = (
	datapoints: DataPoint[],
	k: number,
	minimumDatapoints: number,
): DataPoint[][][] => {
	if (k === 1) return [[datapoints]]
	if (datapoints.length < k * minimumDatapoints) return []

	const partitionRemainder = (
		start: number,
		remainingK: number,
	): DataPoint[][][] => {
		if (remainingK === 1) return [[datapoints.slice(start)]]
		const results: DataPoint[][][] = []

		for (
			let i = start + minimumDatapoints;
			i <= datapoints.length - (remainingK - 1) * minimumDatapoints;
			i++
		) {
			const currentPartition = datapoints.slice(start, i)
			const subsequentPartitions = partitionRemainder(i, remainingK - 1)

			subsequentPartitions.forEach((partition) => {
				results.push([currentPartition, ...partition])
			})
		}

		return results
	}

	return partitionRemainder(0, k)
}

/**
 * Calculates the minimum partitions required, respecting minimum datapoints per partition.
 */
export const calculateMinimumPartitions = ({
	datapoints,
	minRSquared,
	minimumDatapoints = 2,
}: MinimumPartitionArgs): PartitionResult[] => {
	let k = 1

	while (true) {
		if (k === datapoints.length) return []

		const partitions = generatePartitions(datapoints, k, minimumDatapoints)

		if (k === 1) {
			console.log(partitions)
		}

		const validPartition = partitions.find((partition, pindex) =>
			partition.every((segment, index) => {
				const regressionResult = calculateLinearRegression(segment)
				return regressionResult.rSquared >= minRSquared
			}),
		)

		// If a valid partition is found, map its segments to the result format
		if (validPartition) {
			return validPartition.map((segment) => {
				const regressionResult = calculateLinearRegression(segment)
				const regressionLine: RegressionLine = {
					slope: regressionResult.slope,
					intercept: regressionResult.intercept,
					xRange: [
						Math.min(...segment.map((p) => p.x)),
						Math.max(...segment.map((p) => p.x)),
					],
					metric: regressionResult.rSquared,
				}
				return {
					regressionLine,
					rSquared: regressionResult.rSquared,
					datapoints: segment,
				}
			})
		}

		k++
	}
}

export const calculateLinearRegression = (
	datapoints: DataPoint[],
): RegressionResult => {
	const meanX = _.meanBy(datapoints, "x")
	const meanY = _.meanBy(datapoints, "y")
	const slope =
		_.sumBy(datapoints, (p) => (p.x - meanX) * (p.y - meanY)) /
		_.sumBy(datapoints, (p) => (p.x - meanX) ** 2)
	const intercept = meanY - slope * meanX

	const rSquared = calculateRSquared(datapoints, { slope, intercept })

	return { slope, intercept, rSquared }
}

export const calculateRSquared = (
	datapoints: DataPoint[],
	{ slope, intercept }: Omit<RegressionResult, "rSquared">,
): number => {
	const meanY = _.meanBy(datapoints, "y")
	const ssTot = _.sumBy(datapoints, (p) => (p.y - meanY) ** 2)
	const ssRes = _.sumBy(
		datapoints,
		(p) => (p.y - (slope * p.x + intercept)) ** 2,
	)

	return 1 - ssRes / ssTot
}
