/* eslint-disable @typescript-eslint/no-var-requires */
const { PyodidePlugin } = require("@pyodide/webpack-plugin")
const { PrismaPlugin } = require("@prisma/nextjs-monorepo-workaround-plugin")

/** @type {import('next').NextConfig} */

const PYODIDE_LOCATION = `${process.env.NEXT_PUBLIC_VERCEL_BLOB_URL}/pyodide/${process.env.NEXT_PUBLIC_PYODIDE_VERSION}`
const pyodideRegex = /^\/_next\/pyodide\/(.*)$/

module.exports = async () => {
	const withSerwist = (await import("@serwist/next")).default({
		swSrc: "src/app/sw.ts",
		swDest: "public/sw.js",
		maximumFileSizeToCacheInBytes: 50000000,
		manifestTransforms: [
			//workaround for pyodide location caused by pyodide-webpack-plugin requesting an invalid url
			async (manifestEntries) => ({
				manifest: manifestEntries.map((manifestEntry) => {
					const nextPyodideMatch =
						manifestEntry.url.match(pyodideRegex)
					if (nextPyodideMatch) {
						return {
							...manifestEntry,
							url: `${PYODIDE_LOCATION}/${nextPyodideMatch[1]}`,
						}
					}
					return manifestEntry
				}),
			}),
		],
	})

	return withSerwist({
		webpack: (config, { isServer }) => {
			if (!isServer) {
				config.plugins.push(new PyodidePlugin())
			}
			if (isServer) {
				config.plugins.push(new PrismaPlugin())
				config.externals = ["pyodide", ...(config.externals || [])]
			}
			return config
		},
		reactStrictMode: false,
		transpilePackages: ["@colorchordsapp/api", "@colorchordsapp/db"],
	})
}
