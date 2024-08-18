export type PythonScript<Context, OutputType> = {
	context: Context
	script: string
	packages?: string[]
	outputType?: OutputType
}
