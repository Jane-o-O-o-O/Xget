/**
 * Xget - High-performance acceleration engine for developer resources
 * Copyright (C) 2025 Xi Xu
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import { handleRequest } from '../src/index.js';

/**
 * Cloudflare Pages Function handler for all routes.
 *
 * This catch-all route handles all incoming requests to the Xget acceleration engine.
 * It delegates to the main handleRequest function which implements the core logic
 * for proxying, caching, and accelerating developer resources.
 *
 * @param {Object} context - Cloudflare Pages context object
 * @param {Request} context.request - The incoming HTTP request
 * @param {Object} context.env - Environment variables and bindings
 * @param {ExecutionContext} context.functionPath - Path that matched this function
 * @param {Function} context.waitUntil - Method to extend function execution
 * @param {Function} context.passThroughOnException - Method to pass through on error
 * @param {Function} context.next - Next middleware function
 * @param {Object} context.params - Route parameters (path in this case)
 * @returns {Promise<Response>} The HTTP response to return to the client
 *
 * @example
 * // User requests: https://xget.pages.dev/npm/lodash
 * // Pages invokes: onRequest({ request, env, ... })
 * // Returns: Response with package data from npm registry
 *
 * @example
 * // User requests: https://xget.pages.dev/gh/nodejs/node/README.md
 * // Pages invokes: onRequest({ request, env, ... })
 * // Returns: Response with README.md from GitHub
 */
export async function onRequest(context) {
  // Extract request, env, and create a compatible execution context
  const { request, env, waitUntil, passThroughOnException } = context;

  // Create execution context object compatible with Workers API
  const ctx = {
    waitUntil: waitUntil ? waitUntil.bind(context) : () => {},
    passThroughOnException: passThroughOnException
      ? passThroughOnException.bind(context)
      : () => {}
  };

  // Delegate to the main handler
  return handleRequest(request, env, ctx);
}
