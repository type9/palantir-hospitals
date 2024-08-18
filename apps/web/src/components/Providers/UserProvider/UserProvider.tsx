import React from "react"
import { ClerkProvider } from "@clerk/nextjs"

import { APIProvider } from "@/trpc/APIProvider"
export type UserProviderProps = {
	children: React.ReactNode
}

export const UserProvider = ({ children }: UserProviderProps) => {
	return (
		<ClerkProvider
			appearance={{
				variables: {
					colorPrimary: "black", //accent-tertiary-dark
				},
				elements: {
					card: "rounded-boxcorner",
					formButtonPrimary:
						"bg-primary-primary hover:bg-accent-primary-dark",
					headerTitle: "text-style-title",
					headerSubtitle: "text-style-subtitle",
					formFieldLabel: "text-style-bodySmall",
					formFieldInput: "rounded-boxcorner",
					socialButtonsIconButton: "rounded-tiny",
					avatarBox: "size-7",
				},
			}}
		>
				<APIProvider>{children}</APIProvider>
		</ClerkProvider>
	)
}
