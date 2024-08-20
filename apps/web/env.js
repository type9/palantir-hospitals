const z = require("zod")

const envSchema = z.object({
	DATABASE_URL: z.string().min(1),
	BLOB_READ_WRITE_TOKEN: z.string().min(1),
	NEXT_PUBLIC_SHORTID_LENGTH: z.string().min(1),
	NEXT_PUBLIC_VERCEL_BLOB_URL: z.string().min(1),
	NEXT_PUBLIC_PYODIDE_VERSION: z.string().min(1),
	NEXT_PUBLIC_HDBSCAN_WHL: z.string().min(1),
})

// https://bharathvaj-ganesan.medium.com/adding-type-safety-to-environment-variables-in-nextjs-1ffebb4cf07d

const env = envSchema.parse({
	DATABASE_URL: process.env.DATABASE_URL,
	BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
	NEXT_PUBLIC_VERCEL_BLOB_URL: process.env.NEXT_PUBLIC_VERCEL_BLOB_URL,
	NEXT_PUBLIC_PYODIDE_VERSION: process.env.NEXT_PUBLIC_PYODIDE_VERSION,
	NEXT_PUBLIC_HDBSCAN_WHL: process.env.NEXT_PUBLIC_HDBSCAN_WHL,
	NEXT_PUBLIC_SHORTID_LENGTH: process.env.NEXT_PUBLIC_SHORTID_LENGTH,
})

module.exports = { env }
