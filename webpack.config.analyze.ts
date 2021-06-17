import { createClientConfig } from "./build/config/index";
import path from "path";
import type { Configuration } from "webpack";

export default function conf(env): Configuration {
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
			filename: "[hash]/[name]",
			chunkFilename: "[hash]/[name].[id]",
			publicPath: "client/",
		},
	};
}
