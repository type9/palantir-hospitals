import { nanoid } from "nanoid"

export const generateShortId = () =>
	nanoid(Number(process.env.NEXT_PUBLIC_SHORTID_LENGTH as string))
