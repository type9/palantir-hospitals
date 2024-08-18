import { NextRequest } from "next/server"

export const cookieKeys = {
	sessionType: "sessionType",
	sessionId: "sessionId",
}

export const getCookieKey = (key: keyof typeof cookieKeys) => cookieKeys[key]

export const getCookieValue = (
	req: NextRequest,
	key: keyof typeof cookieKeys,
): string | undefined => {
	return req.cookies.get(getCookieKey(key))?.value
}
