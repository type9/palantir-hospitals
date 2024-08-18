import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
	publicRoutes: ["/", "/api/:path*", "/public/:path*"],
})

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/"],
}
