
import * as urlDefs from "@/webmeta/navigation/UrlDefinitions"

const getStaticUrl = (key: string) => {
	switch (key) {
		//Calculators
		case "dim6Calc":
			return urlDefs.dim6Calc
		case "noteCalc":
			return urlDefs.noteCalc

		//Library
		case "allChords":
			return urlDefs.chordsAllUrl
		case "allScales":
			return urlDefs.scalesAllUrl

		//Models
		case "allKeys":
			return urlDefs.keysAllUrl
		default:
			return ""

		//Tools
		case "liveCompanion":
			return urlDefs.liveCompanion
	}
}

export default getStaticUrl
