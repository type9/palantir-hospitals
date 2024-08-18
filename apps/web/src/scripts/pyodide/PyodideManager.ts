// pyodideManager.js
import { loadPyodide, PyodideInterface } from "pyodide"

const getPythonPackagesBlob = async () =>
	await fetch("/api/get-python-packages-blob").then((res) => res.json())

const getPyodideBlob = async () =>
	await fetch("/api/get-pyodide-blob").then((res) => res.json())

const loadPackages = async (pyodide: PyodideInterface, packages: string[]) => {
	const packageIndexUrl = await getPythonPackagesBlob().then(
		(blob) => blob.indexUrl,
	)
	const packagesRewritten = packages.map((pkgName) =>
		pkgName.endsWith(".whl") ? `${packageIndexUrl}${pkgName}` : pkgName,
	)
	await pyodide.loadPackage("micropip")
	const micropip = await pyodide.pyimport("micropip")
	await micropip.install(packagesRewritten, true)
}

const initializePyodide = async (
	packages?: string[],
): Promise<PyodideInterface | undefined> => {
	const indexURL = await getPyodideBlob().then((blob) => blob.indexUrl)
	try {
		const loadedPyodide = await loadPyodide({ indexURL })
		if (packages && packages.length > 0) {
			await loadPackages(loadedPyodide, packages)
		}
		return loadedPyodide
	} catch (err) {
		console.error("Error initializing Pyodide:", err)
	}
}

class PyodideManager {
	static instance: PyodideInterface | undefined = undefined

	static async loadInstance(
		packages?: string[],
	): Promise<PyodideInterface | undefined> {
		if (!PyodideManager.instance) {
			// You would handle package loading inside initializePyodide function
			PyodideManager.instance = await initializePyodide(packages)
		}
		return PyodideManager.instance
	}

	static getInstance(): PyodideInterface | undefined {
		return PyodideManager.instance
	}
}

export default PyodideManager
