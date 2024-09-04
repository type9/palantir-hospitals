export const sortKeywords = (
	keyword1: string,
	keyword2: string,
): [string, string] => {
	return keyword1 < keyword2 ? [keyword1, keyword2] : [keyword2, keyword1]
}
