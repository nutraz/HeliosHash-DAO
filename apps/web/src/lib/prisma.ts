// Lazily instantiate Prisma Client to avoid loading the native query engine
// during Next.js static build/prerender phases where the runtime binary may
// not be available. We return a proxy that forwards property access to the
// real PrismaClient instance, only creating it on first use.
import type { PrismaClient } from '@prisma/client'

let _prisma: PrismaClient | undefined

function getPrismaClient(): PrismaClient {
	if (_prisma) return _prisma
	// Use require so this code path is not exercised at import time during RSC build
	// when the native engine may be missing for this environment.
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const { PrismaClient: PC } = require('@prisma/client')
	_prisma = new PC()
	return _prisma!
}

export const prisma = new Proxy(
	{},
	{
		get(_target, prop) {
			const client = getPrismaClient()
			// @ts-ignore - forward property access to runtime PrismaClient
			return client[prop]
		},
		// allow calling as a function for some edge-cases (not typical)
		apply(_target, thisArg, args) {
			const client = getPrismaClient()
			// @ts-ignore
			return (client as any).apply(thisArg, args)
		},
	}
) as unknown as PrismaClient
