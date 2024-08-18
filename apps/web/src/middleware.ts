import { clerkMiddleware } from "@clerk/nextjs/server"

import { withAnonymousAuth } from "./middlewares/withAnonymousAuth"

export default clerkMiddleware(async (auth, req, event) => {
	//excludes internally used auth routes.
	if (req.nextUrl.pathname.startsWith("/api/auth")) {
		return
	}

	if (auth().userId === null) {
		return await withAnonymousAuth(req, event)
	}
})
export const config = {
	matcher: [
		// Skip Next.js internals and all static files
		"/((?!_next|_vercel|.*\\..*).*)",
		// Run for all API routes
		"/api/(.*)",
	],
}
