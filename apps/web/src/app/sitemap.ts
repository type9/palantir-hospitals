import { MetadataRoute } from "next"

const ROOT_PATH = "https://neonchords.com"

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: `${ROOT_PATH}`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 1,
		},
		{
			url: `${ROOT_PATH}/chords/all`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${ROOT_PATH}/scales/all`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${ROOT_PATH}/keys/all`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${ROOT_PATH}/modalspace`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.5,
		},
	]
}
