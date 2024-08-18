"use client"

import { useEffect, useState } from "react"

import { PythonScript } from "@/scripts/models/script"
import { UsePyodideState } from "./usePyodide"

export type UsePythonScriptProps<Context, OuputType> = PythonScript<
	Context,
	OuputType
> &
	UsePyodideState

export type UsePythonScriptReturn<OutputType> = {
	output: OutputType | undefined
}

export const usePythonScript = <Context, ReturnType, InputStoreType = any>({
	pyodide,
	isLoading,
	context,
	script,
	//used to store data associated with this script to be used after output
	lastInputStore,
	//disable the script from running
	disable,
}: UsePythonScriptProps<Context, ReturnType> & {
	lastInputStore?: InputStoreType
	disable?: boolean
}) => {
	const [output, setOutput] = useState<{
		output?: ReturnType
		outputDep?: string
		lastInputStore?: InputStoreType
	}>({})

	useEffect(() => {
		if (pyodide === undefined || isLoading || disable) return
		const locals = pyodide.toPy(context)

		pyodide
			.runPythonAsync(script, { locals })
			.then((output: any) =>
				setOutput({
					output: output.toJs(),
					outputDep: JSON.stringify(context),
					lastInputStore,
				}),
			)
			.catch((err) =>
				console.log({ err, script, context, lastInputStore }),
			)
	}, [pyodide, script, isLoading, disable, context])

	return output
}
