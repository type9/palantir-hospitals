import { PrismaClient } from "../lib/generated/client"

export const db = new PrismaClient()

export * from "../lib/generated/client"
