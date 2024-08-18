import { PrismaAdapter } from "@lucia-auth/adapter-prisma"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

import { PrismaClient } from "../lib/generated/client"

const connectionString = process.env.DATABASE_URL

//allows for compatibility with next edge. see https://www.prisma.io/docs/orm/overview/databases/postgresql#using-the-node-postgres-driver
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
export const db = new PrismaClient({ adapter })

export const luciaAnonymousAdapter = new PrismaAdapter(
	db.anonymousSession,
	db.anonymousUser,
)

export * from "../lib/generated/client"
