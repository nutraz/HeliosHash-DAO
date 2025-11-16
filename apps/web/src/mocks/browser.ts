// handlers are created at runtime using MSW's `rest` helper. We import the
// factory dynamically to avoid server-side imports of `msw`.

// Export a build-safe `worker` object. On the server this is a noop; in the
// browser we dynamically import `msw` and initialise the real worker. Dynamic
// import avoids TypeScript/SSR resolution issues during Next.js server builds.
export let worker: { start: () => Promise<void> } = {
	start: async () => {},
}

if (typeof window !== 'undefined') {
	;(async () => {
		try {
			// Dynamically import MSW at runtime in the browser. Use a broad import
			// and pick `setupWorker` to avoid hard TS named-import issues.
			// @ts-ignore - runtime-only import, types may be unresolved in build.
			const msw = await import('msw')
			// @ts-ignore - use `any` access to avoid TypeScript complaining about exported
			// members in differing MSW bundle shapes across versions.
			const setupWorker = (msw as any).setupWorker || (msw as any).default?.setupWorker
			if (typeof setupWorker === 'function') {
				// Load the handlers factory and create handlers using MSW's `rest`.
				try {
					// @ts-ignore - dynamic import of local module
					  const handlersMod = await import('./handlers')
					  const createHandlers = handlersMod.createHandlers
					const handlers = typeof createHandlers === 'function' ? createHandlers((msw as any).rest) : []
					// @ts-ignore
					worker = setupWorker(...handlers)
				} catch (e) {
					// eslint-disable-next-line no-console
					console.warn('Failed to load handlers for MSW:', e)
				}
			}
		} catch (err) {
			// If import/setup fails, leave the noop worker in place.
			// This prevents server/build failures and makes the module safe for SSR.
			// eslint-disable-next-line no-console
			console.warn('MSW worker failed to initialize:', err)
		}
	})()
}
