"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = createClient;
function createClient(options) {
    const base = options?.baseUrl ?? 'http://localhost:8000';
    return {
        async getContractInfo(name) {
            // placeholder request — replace with real endpoint or canister calls
            const res = await fetch(`${base}/api/contracts/${encodeURIComponent(name)}`);
            if (!res.ok)
                throw new Error(`Failed to fetch contract ${name}`);
            return (await res.json());
        },
    };
}
exports.default = createClient;
