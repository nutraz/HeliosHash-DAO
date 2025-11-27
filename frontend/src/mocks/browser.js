// Export a factory that creates the MSW worker using dynamic import.
// This prevents the bundler from trying to resolve 'msw' at build time
// when mocks are not installed or not intended for production builds.
export async function getWorker() {
	const [{ setupWorker }, { handlers }] = await Promise.all([
		import('msw'),
		import('./handlers')
	])

	return setupWorker(...handlers)
}
