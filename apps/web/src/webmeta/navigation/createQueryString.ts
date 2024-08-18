export const createQueryString = ({
	name,
	value,
	searchParams,
}: {
	name: string
	value?: string | number
	searchParams?: string
}) => {
	if (!value) return ""
	const params = new URLSearchParams(searchParams)
	params.set(name, String(value))

	return params.toString()
}
