/** @type {import("eslint").Linter.Config} */
module.exports = {
	root: true,
	extends: ["@colorchordsapp/eslint-config/next.js"],
	env: {
		browser: true,
		es2021: true,
		node: true,
		worker: true,
	},
	rules: {
		"react/react-in-jsx-scope": "off",
		"@typescript-eslint/explicit-module-boundary-types": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"react-hooks/exhaustive-deps": "off",
		"import/no-unresolved": "error",
		"no-constant-condition": "warn",
		"no-unused-vars": "warn",
		"unused-imports/no-unused-imports": "warn",
		"no-empty-pattern": "warn",
	},
	globals: {
		NodeJS: "readonly",
	},
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		tsconfigRootDir: __dirname,
		project: ["./tsconfig.json"],
	},
	plugins: ["import"],
}
