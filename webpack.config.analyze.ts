import {
	createClientConfig,
	createServerConfig,
	createServiceWorkerConfig,
} from "./build/config";
import path from "path";

export default function conf(env) {
	if (!process.env.NODE_ENV) {
		process.env.NODE_ENV = env?.production ? "production" : "development";
	}

	console.info(JSON.stringify(env, null, 2));

	delete process.env.TS_NODE_PROJECT;

	const clientConfig = createClientConfig(env);

	return {
		...clientConfig,
		entry: {
			main: "./src/client.ts",
		},
		output: {
			path: path.resolve("./__sapper__/dev/client"),
			filename: "[hash]/[name].js",
			chunkFilename: "[hash]/[name].[id].js",
			publicPath: "client/",
		},
	};
}
