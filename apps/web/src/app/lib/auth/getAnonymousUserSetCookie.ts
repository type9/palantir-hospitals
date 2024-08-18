"use server"

import { NextRequest, NextResponse } from "next/server"

import { createAnonymousUserAndSession } from "./anonymous/createAnonymousUserAndSession"
import { getAnonymousUser } from "./anonymous/getAnonymousUser"
import { applySessionDataToSetCookie } from "./applySessionData"

//detects existing session or creates a new anonymous session. designed to be used in middleware. returns userId, anonymous or clerk
export const getAnonymousUserSetCookie = async ({
	req,
	res,
}: {
	req: NextRequest
	res?: NextResponse
}): Promise<NextResponse> => {
	//if registered as anonymous user, validate session
	const anonymousAuth = await getAnonymousUser(req)

	if (anonymousAuth?.userId)
		return applySessionDataToSetCookie({
			appSession: {
				sessionId: anonymousAuth.session.id,
				sessionType: "anonymous",
			},
			response: res,
		})

	//if no session, create new anonymous user and session
	const newAnonymousAuth = await createAnonymousUserAndSession()
	if (newAnonymousAuth)
		return applySessionDataToSetCookie({
			appSession: {
				sessionId: newAnonymousAuth.session.id,
				sessionType: "anonymous",
			},
			response: res,
		})

	//catch all
	throw new Error(
		"Error resolving anonymous session. Unable to detect or create new anonymous user",
	)
}
