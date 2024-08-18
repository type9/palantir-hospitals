"use client"

import { createBrowserClient } from "@supabase/ssr"
import { SupabaseClient } from "@supabase/supabase-js"
import React, { createContext } from "react"

export type SupabaseProviderProps = {
	children: React.ReactNode
}

export const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
	const SupabaseClientContext = createContext<{
		supabaseClient: SupabaseClient | null
	}>({
		supabaseClient: null,
	})

	const supabaseClient = createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
	)
	const context = { supabaseClient }

	return (
		<SupabaseClientContext.Provider value={context}>
			{children}
		</SupabaseClientContext.Provider>
	)
}
