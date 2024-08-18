import _ from "lodash"

export const replaceLastWord = (sentence: string, word = "") => {
	const sentenceWords = sentence.split(" ")
	sentenceWords.pop()
	return _.join([...sentenceWords, word], " ")
}
