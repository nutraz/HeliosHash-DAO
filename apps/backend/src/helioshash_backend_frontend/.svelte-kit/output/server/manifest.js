export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".ic-assets.json5","favicon.ico","logo2.svg"]),
	mimeTypes: {".json5":"application/json5",".svg":"image/svg+xml"},
	_: {
		client: {start:"_app/immutable/entry/start.CRb-vGYg.js",app:"_app/immutable/entry/app.D3FIezWe.js",imports:["_app/immutable/entry/start.CRb-vGYg.js","_app/immutable/chunks/CgfcaKQW.js","_app/immutable/chunks/DWYFH0fm.js","_app/immutable/entry/app.D3FIezWe.js","_app/immutable/chunks/DWYFH0fm.js","_app/immutable/chunks/IHki7fMi.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		remotes: {
			
		},
		routes: [
			
		],
		prerendered_routes: new Set(["/"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
