// import MiniCssExtractPlugin from "mini-css-extract-plugin";
import {
	tsLoaderRule,
	svelteLoaderRule,
	scssLoaderRule,
	fileLoaderRule,
	mjsLoaderRule,
} from "@raythurnevoid/svelte-template/build/module/rules";
import type { BaseEnv } from "../types";
import type { Configuration } from "webpack";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import { createConfig } from "@raythurnevoid/svelte-template/build/config";
import config from "sapper/config/webpack.js";
import pkg from "../../package.json";

export function createClientConfig(env: BaseEnv): Configuration {
	const baseConf: Configuration = createConfig({
		...env,
	});

	const plugins = [];

	if (env.analyzeBundle) {
		plugins.push(new BundleAnalyzerPlugin());
	}

	return {
		...baseConf,
		entry: {
			main: config.client.entry().main.replace(/\.js$/, ".ts"),
		},
		output: config.client.output(),
		module: {
			rules: [...baseConf.module.rules],
		},
		plugins: [...plugins],
	};
}

export function createServerConfig(env: BaseEnv): Configuration {
	const baseConf: Configuration = createConfig({
		...env,
		server: true,
	});

	return {
		...baseConf,
		entry: {
			server: config.server.entry().server.replace(/\.js$/, ".ts"),
		},
		output: config.server.output(),
		resolve: {
			...baseConf.resolve,
			mainFields: ["svelte", "module", "main"],
		},
		module: {
			rules: [
				tsLoaderRule({ env }),
				...svelteLoaderRule({ env, ssr: true }),
				scssLoaderRule({ env }),
				fileLoaderRule(),
			],
		},
		externals: Object.keys(pkg.dependencies).concat("encoding"),
		plugins: [],
		performance: {
			hints: false, // it doesn't matter if server.js is large
		},
	};
}

export function createServiceWorkerConfig(env: BaseEnv): Configuration {
	const baseConf: Configuration = createConfig({
		...env,
	});

	return {
		...baseConf,
		entry: {
			"service-worker": config.serviceworker
				.entry()
				["service-worker"].replace(/\.js$/, ".ts"),
		},
		output: config.serviceworker.output(),
		module: {
			rules: [tsLoaderRule({ env }), mjsLoaderRule()],
		},
		plugins: [],
	};
}
