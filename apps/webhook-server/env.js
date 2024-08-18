const z = require("zod")

const envSchema = z.object({
	DATABASE_URL: z.string().min(1),
	BLOB_READ_WRITE_TOKEN: z.string().min(1),
	CLERK_SECRET_KEY: z.string().min(1),
	WEBHOOK_SECRET: z.string().min(1),
})

// https://bharathvaj-ganesan.medium.com/adding-type-safety-to-environment-variables-in-nextjs-1ffebb4cf07d

const env = envSchema.parse({
	DATABASE_URL: process.env.DATABASE_URL,
	BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
	CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
	WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
})

module.exports = { env }
