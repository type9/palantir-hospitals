import { NextRequest, NextResponse } from "next/server"
import { luciaAnonymousAdapter } from "@colorchordsapp/db"
import { Cookie, Lucia, Session, TimeSpan } from "lucia"

export const anonymousLucia = new Lucia(luciaAnonymousAdapter, {
	sessionExpiresIn: new TimeSpan(2, "w"),
	sessionCookie: {
		expires: false,
		attributes: {
			secure: process.env.NODE_ENV === "production",
		},
	},
})

declare module "lucia" {
	interface Register {
		Lucia: typeof anonymousLucia
	}
}

// Custom function to generate a random ID (using Web Crypto API)
export const generateAnonymousSessionId = () => {
	const array = new Uint8Array(10)
	crypto.getRandomValues(array)
	return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
		"",
	)
}

export const anonymousSessionCookieName = anonymousLucia.sessionCookieName

export const getAnonymousSessionCookie = (req: NextRequest) =>
	req.cookies.get(anonymousSessionCookieName)?.value

export const setAnonymousSessionCookie = (
	response: NextResponse,
	sessionCookie: Cookie,
) =>
	response.cookies.set(
		sessionCookie.name,
		sessionCookie.value,
		sessionCookie.attributes,
	)

export type AnonymousAuth = {
	userId: string
	session: Session
	sessionCookie: Cookie
}
