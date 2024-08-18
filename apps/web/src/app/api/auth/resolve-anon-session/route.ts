import type { NextRequest } from "next/server"

import { getAnonymousUserSetCookie } from "@/app/lib/auth/getAnonymousUserSetCookie"

/*
 * resolve-session API route
 * This route extracts multiple possible authentication methods and returns a single valid session.
 */

const handler = async (req: NextRequest) =>
	await getAnonymousUserSetCookie({ req })

export { handler as GET }
