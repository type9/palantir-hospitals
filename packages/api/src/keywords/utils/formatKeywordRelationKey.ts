const sortKeywordsInternal = (
	keyword1: string,
	keyword2: string,
): [string, string] => {
	return keyword1 < keyword2 ? [keyword1, keyword2] : [keyword2, keyword1]
}

export const formatKeywordRelationKey = (
	fromKeywordKey: string,
	toKeywordKey: string,
) => {
	const [firstKeywordKey, secondKeywordKey] = sortKeywordsInternal(
		fromKeywordKey,
		toKeywordKey,
	)
	return `${firstKeywordKey}-${secondKeywordKey}`
}
