export type Cookies = EssentialCookies

export type EssentialCookies = {
	anonymousSessionId: string
	sessionType: AppSessionType
}

export type AppSession = {
	userId?: string
	sessionId: string
	sessionType: AppSessionType
}

export type AnonymousAppSession = {
	anonymousSessionId: string
	anonymousUserId: string
}

export type AppSessionType = "clerk" | "anonymous"
