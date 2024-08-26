import { createId } from "@paralleldrive/cuid2"

import { PrismaClient } from "../lib/generated/client"

export const db = new PrismaClient()

export const createDefaultId = () => createId()

export * from "../lib/generated/client"
