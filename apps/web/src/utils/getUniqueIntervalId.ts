
import { Degree } from "@/musictheory/models/Degree"
import { Interval } from "@/musictheory/models/Interval"
import { Scale } from "@/musictheory/models/Scale"

interface ScaleAndDegreesArgs {
	scale: Scale
	degrees: Degree[]
}

interface IntervalsArgs {
	intervals: Interval[]
}

export interface GetUniqueIntervalIdArgs {
	scale?: Scale
	degrees?: Degree[]
	intervals?: Interval[]
}

// export default function getUniqueIntervalId({
// 	scale,
// 	degrees,
// 	intervals,
// }: GetUniqueIntervalIdArgs): string | undefined {
// 	const JOIN_CHAR = ","

// 	if (intervals && intervals.length > 0)
// 		return _.join(intervals.map((i) => i.id, JOIN_CHAR))

// 	if (scale && degrees && degrees.length > 0)
// 		return _.join(
// 			getIntervalsFromDegrees(scale, degrees).map((i) => i.id),
// 			JOIN_CHAR,
// 		)

// 	return undefined
// }
