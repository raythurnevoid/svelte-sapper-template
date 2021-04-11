// import MiniCssExtractPlugin from "mini-css-extract-plugin";
import {
	tsLoaderRule,
	mjsLoaderRule,
} from "@raythurnevoid/svelte-template/build/module/rules";
import type { Configuration, WebpackPluginInstance } from "webpack";
import { createConfig } from "@raythurnevoid/svelte-template/build/config";
import type { SvelteTempalteConfigurationInput } from "@raythurnevoid/svelte-template/build/config";
import config from "sapper/config/webpack.js";
import pkg from "../../package.json";
import {
	bundleAnalyzerPlugin,
	cssExtractPlugin,
	cssMinimizerPlugin,
} from "@raythurnevoid/svelte-template/build/plugins";

export function createClientConfig(
	input: SvelteTempalteConfigurationInput
): Configuration {
	const { env } = input;

	const baseConf: Configuration = createConfig(input);

	const plugins: WebpackPluginInstance[] = [];

	if (input.env.production) {
		plugins.push(cssMinimizerPlugin());
	}

	if (input.extractCss) {
		plugins.push(cssExtractPlugin());
	}

	if (env.analyzeBundle) {
		plugins.push(bundleAnalyzerPlugin());
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

export function createServerConfig(
	input: SvelteTempalteConfigurationInput
): Configuration {
	const { env } = input;

	const baseConf: Configuration = createConfig({
		...input,
		env: {
			...env,
			server: true,
		},
	});

	return {
		...baseConf,
		entry: {
			server: config.server.entry().server.replace(/\.js$/, ".ts"),
		},
		output: config.server.output(),
		resolve: {
			...baseConf.resolve,
		},
		externals: Object.keys(pkg.dependencies).concat("encoding"),
		performance: {
			hints: false, // it doesn't matter if server.js is large
		},
	};
}

export function createServiceWorkerConfig(
	input: SvelteTempalteConfigurationInput
): Configuration {
	const { env } = input;

	const baseConf: Configuration = createConfig(input);

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
