import _ from "lodash"

export const mergeObjects = (object1: any, object2: any) =>
	_.assignWith({}, object1, object2, (objValue, srcValue) => {
		// If the source value is not undefined, use it, otherwise use the object value
		return srcValue === undefined ? objValue : srcValue
	})
