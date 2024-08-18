/** @type {import("eslint").Linter.Config} */

module.exports = {
	parser: "@typescript-eslint/parser",
	ignorePatterns: ["apps/**", "packages/**"],
	extends: ["@convoform/eslint-config/library.js"],
	plugins: ["@typescript-eslint", "prettier"],
	rules: {
		"prettier/prettier": "warn",
		"no-unused-vars": "off",
		"@typescript-eslint/no-unused-vars": "off",
		"@typescript-eslint/ban-types": "warn",
		"@typescript-eslint/no-explicit-any": "warn",
	},
	parserOptions: {
		ecmaVersion: "latest",
		tsconfigRootDir: __dirname,
		project: ["./apps/*/tsconfig.json", "./packages/**/*/tsconfig.json"],
	},
}
