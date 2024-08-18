import _ from "lodash"

import {
	AnyInterval,
	Interval,
	isValidInterval,
} from "@/musictheory/models/Interval"

const parseIntervalInputs = (intervalInput: string) =>
	_.split(_.trim(intervalInput), " ")
		.filter((s) => isValidInterval(s))
		.map((s) => new Interval(s as AnyInterval))

export default parseIntervalInputs
