export const retryWithCooldown = async <T>(
	fn: () => Promise<T>,
	retries: number,
	cooldown: number,
): Promise<T> => {
	let attempts = 0
	while (attempts < retries) {
		try {
			return await fn()
		} catch (error) {
			attempts++
			console.error(`Attempt ${attempts} failed: ${error}`)
			if (attempts < retries) {
				console.log(`Retrying in ${cooldown / 1000} seconds...`)
				await new Promise((resolve) => setTimeout(resolve, cooldown))
			} else {
				throw new Error(`All ${retries} attempts failed.`)
			}
		}
	}
	throw new Error("This should never happen.") // Just in case loop logic fails
}
