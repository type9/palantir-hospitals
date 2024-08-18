import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin"

/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config, { isServer }) => {
		if (!isServer) {
		}
		if (isServer) {
			config.plugins.push(new PrismaPlugin())
			config.externals = ["pyodide", ...(config.externals || [])]
		}
		return config
	},
	reactStrictMode: false,
	transpilePackages: ["@colorchordsapp/api", "@colorchordsapp/db"],
}

export default nextConfig
