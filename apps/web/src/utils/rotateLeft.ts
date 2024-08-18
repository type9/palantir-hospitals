export default function rotLeft(a: any[], d: number) {
	if (d < 0) throw new Error("rotLeft distance must be greater than 0")
	var arr = []
	var l = 0
	for (let i = 0; i < a.length; i++) {
		if (i >= d) {
			arr[i - d] = a[i]
		} else {
			arr[a.length - d + l] = a[i]
			l = i + 1
		}
	}
	return arr
}
