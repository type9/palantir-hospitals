import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server"

import { createCallerFactory } from "./context"
import { webhookRouter, WebhookRouter } from "./webhookRouter"

/**
 * Create a server-side caller for the tRPC API
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createWebhookCaller = createCallerFactory(webhookRouter)

/**
 * Inference helpers for input types
 * @example
 * type PostByIdInput = RouterInputs['post']['byId']
 *      ^? { id: number }
 **/
export type WebhookRouterInputs = inferRouterInputs<WebhookRouter>

/**
 * Inference helpers for output types
 * @example
 * type AllPostsOutput = RouterOutputs['post']['all']
 *      ^? Post[]
 **/
export type WebhookRouterOutputs = inferRouterOutputs<WebhookRouter>
