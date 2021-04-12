import type { Configuration } from "webpack";
import {
	createClientConfig,
	createServerConfig,
	createServiceWorkerConfig,
} from "./build/config";

function conf(env) {
	if (!process.env.NODE_ENV) {
		process.env.NODE_ENV = env?.production ? "production" : "development";
	}

	console.info(JSON.stringify(env, null, 2));

	delete process.env.TS_NODE_PROJECT;

	const clientConfig = createClientConfig({ env });
	const serverConfig = createServerConfig({ env });
	const serviceWorkerConfig = createServiceWorkerConfig({ env });

	return {
		client: {
			...clientConfig,
		} as Configuration,
		server: {
			...serverConfig,
		} as Configuration,
		serviceworker: {
			...serviceWorkerConfig,
		} as Configuration,
	};
}

export default conf({
	production: process.env.NODE_ENV === "development" ? false : true,
});
