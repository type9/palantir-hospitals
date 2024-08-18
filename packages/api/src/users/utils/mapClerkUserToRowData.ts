import { UserJSON } from "@clerk/nextjs/server"
import { Prisma } from "@colorchordsapp/db"
import { TRPCError } from "@trpc/server"

export const mapClerkUserJsonToRowData = (
	data: UserJSON,
): Omit<Prisma.UserCreateInput, "id"> => {
	if (!data.id || !data.username)
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Invalid Clerk user data provided",
		})
	return {
		username: data.username,
		clerkId: data.id,
		firstName: data.first_name,
		lastName: data.last_name,
		createdAt: new Date(data.created_at),
		lastUpdated: new Date(data.updated_at),
		lastSignInAt: data.last_sign_in_at
			? new Date(data.last_sign_in_at)
			: null,
		emailAddresses: JSON.stringify(data.email_addresses),
		externalAccounts: JSON.stringify(data.external_accounts),
	}
}
