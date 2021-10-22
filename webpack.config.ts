import type { BaseEnv } from "@raythurnevoid/svelte-template/cjs/build/types";
import type { Configuration } from "webpack";
import {
	createClientConfig,
	createServerConfig,
	createServiceWorkerConfig,
} from "./build/config";

async function conf(env: BaseEnv) {
	if (!process.env.NODE_ENV) {
		process.env.NODE_ENV = env?.production ? "production" : "development";
	}

	console.info(JSON.stringify(env, null, 2));

	delete process.env.TS_NODE_PROJECT;

	const clientConfig = await createClientConfig({ env });
	const serverConfig = await createServerConfig({ env });
	const serviceWorkerConfig = await createServiceWorkerConfig({ env });

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

export default async () =>
	conf({
		production: process.env.NODE_ENV === "development" ? false : true,
		fancyProgress: true,
	} as BaseEnv);
