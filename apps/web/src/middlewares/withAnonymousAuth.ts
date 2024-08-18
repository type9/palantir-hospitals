import { cookies } from "next/headers"
import { NextResponse, type NextMiddleware } from "next/server"

export const withAnonymousAuth: NextMiddleware = async (request, event) => {
	try {
		// Perform the fetch operation to the API route
		const response = await fetch(
			`${request.nextUrl.origin}/api/auth/resolve-anon-session`,
			{
				headers: { Cookie: cookies().toString() },
			},
		)

		// Check if the response is successful
		if (response.ok) {
			// Clone the response so we can read it and pass it through
			const clonedResponse = response.clone()

			// Assuming the API call returns a set-cookie header for anonymous authentication
			const newCookies = clonedResponse.headers.get("set-cookie")
			if (newCookies) {
				// Set the new cookie header on the response
				const nextResponse = NextResponse.next()
				nextResponse.headers.set("set-cookie", newCookies)
				return nextResponse
			}

			// If no new cookies, just pass through the response
			return response
		} else {
			// Handle non-successful responses
			console.error(
				"Failed to resolve anonymous session:",
				await response.text(),
			)
			return new NextResponse("Authentication error", {
				status: response.status,
			})
		}
	} catch (error) {
		// Catch and log any errors
		console.error("Error during anonymous auth:", error)
		return new NextResponse("Internal server error", { status: 500 })
	}
}
