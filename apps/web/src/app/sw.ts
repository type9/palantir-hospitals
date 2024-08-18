import { defaultCache } from "@serwist/next/worker"
import type {
	PrecacheEntry,
	RuntimeCaching,
	SerwistGlobalConfig,
} from "serwist"
import { CacheFirst, ExpirationPlugin, Serwist } from "serwist"

const PYODIDE_LOCATION = `${process.env.NEXT_PUBLIC_VERCEL_BLOB_URL}/pyodide/${process.env.NEXT_PUBLIC_PYODIDE_VERSION}`
const PYTHON_PACKAGE_LOCATION = `${process.env.NEXT_PUBLIC_VERCEL_BLOB_URL}/python-packages`

declare global {
	interface WorkerGlobalScope extends SerwistGlobalConfig {
		__SW_MANIFEST: (PrecacheEntry | string)[] | undefined
	}
}

declare const self: WorkerGlobalScope

const runtimeCache: RuntimeCaching[] = [
	...defaultCache,
	{
		matcher: new RegExp(`${PYODIDE_LOCATION}/.*`),
		handler: new CacheFirst({
			cacheName: `pyodide-packages`,
			plugins: [
				new ExpirationPlugin({
					maxEntries: 20,
					maxAgeSeconds: 365 * 24 * 60 * 60, // One year
				}),
			],
		}),
	},
	{
		matcher: new RegExp(`${PYTHON_PACKAGE_LOCATION}/.*`),
		handler: new CacheFirst({
			cacheName: "python-packages",
			plugins: [
				new ExpirationPlugin({
					maxEntries: 50,
					maxAgeSeconds: 365 * 24 * 60 * 60, // One year
				}),
			],
		}),
	},
]

const serwist = new Serwist({
	precacheEntries: self.__SW_MANIFEST,
	skipWaiting: true,
	clientsClaim: true,
	runtimeCaching: runtimeCache,
	navigationPreload: true,
})

serwist.addEventListeners()
