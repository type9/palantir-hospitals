"use client"

import { useEffect, useState } from "react"
import _ from "lodash"
import { PyodideInterface } from "pyodide"

import PyodideManager from "@/scripts/pyodide/PyodideManager"

export type UsePyodideProps = {
	packages?: string[]
}

export type UsePyodideState = {
	pyodide?: PyodideInterface
	isLoading: boolean
}

export const usePyodide = ({ packages }: UsePyodideProps): UsePyodideState => {
	const [state, setState] = useState<UsePyodideState>({
		pyodide: PyodideManager.getInstance(), // Get the existing instance, if any
		isLoading: !PyodideManager.getInstance(), // If there is no instance, we're loading
	})

	const debouncedLoad = _.debounce(async (isSubscribed: boolean) => {
		if (!PyodideManager.getInstance()) {
			setState((prevState) => ({ ...prevState, isLoading: true }))
			const pyodide = await PyodideManager.loadInstance(packages)
			if (isSubscribed) setState({ pyodide, isLoading: false })
		}
	}, 1000)

	useEffect(() => {
		let isSubscribed = true

		debouncedLoad(isSubscribed)

		return () => {
			isSubscribed = false
		}
	}, [packages])

	return state
}
