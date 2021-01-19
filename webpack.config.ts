import { createClientConfig, createServerConfig, createServiceWorkerConfig } from "./build/config";

function conf(env) {
	if (!process.env.NODE_ENV) {
		process.env.NODE_ENV = env?.production ? "production" : "development";
	}

	console.info(JSON.stringify(env, null, 2));

	delete process.env.TS_NODE_PROJECT;

	const clientConfig = createClientConfig(env);
	const serverConfig = createServerConfig(env);
	const serviceWorkerConfig = createServiceWorkerConfig(env);

	return {
		client: {
			...clientConfig
		},

		server: {
			...serverConfig
		},

		serviceworker: {
			...serviceWorkerConfig
		},
	};
}

export default conf({
	env: process.env.NODE_ENV === "production" ? "production" : "development",
});
