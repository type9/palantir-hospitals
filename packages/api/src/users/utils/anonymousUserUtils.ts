// Custom function to generate a random ID (using Web Crypto API)
export const generateAnonymousUserId = () => {
	const array = new Uint8Array(10)
	crypto.getRandomValues(array)
	return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
		"",
	)
}
