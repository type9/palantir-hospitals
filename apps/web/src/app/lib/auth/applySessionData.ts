import { NextResponse } from "next/server"

import { getCookieKey } from "@/webmeta/cookies/constants"
import { AppSession } from "@/webmeta/cookies/cookiesModel"
import { anonymousSessionCookieName } from "./anonymous/anonymousAuth"

export const applySessionDataToSetCookie = ({
	appSession,
	response,
}: {
	appSession: AppSession
	response?: NextResponse
}) => {
	const newRes = response || new NextResponse()

	newRes.headers.set(
		"set-cookie",
		`${anonymousSessionCookieName}=${appSession.sessionId}`,
	)

	return newRes
}
