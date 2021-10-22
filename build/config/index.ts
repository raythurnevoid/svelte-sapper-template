// import MiniCssExtractPlugin from "mini-css-extract-plugin";
import {
	tsLoaderRule,
	mjsLoaderRule,
	svelteLoaderRule,
	scssLoaderRule,
	scssModulesLoaderRule,
	fileLoaderRule,
} from "@raythurnevoid/svelte-template/build/module/rules/index.js";
import type { Configuration, WebpackPluginInstance } from "webpack";
import { createConfig } from "@raythurnevoid/svelte-template/build/config/index.js";
import type { SvelteTemplateConfigurationInput } from "@raythurnevoid/svelte-template/build/config/index.js";
import config from "sapper/config/webpack";
import pkg from "../../package.json";
import {
	bundleAnalyzerPlugin,
	cssExtractPlugin,
	cssMinimizerPlugin,
} from "@raythurnevoid/svelte-template/build/plugins/index.js";

export async function createClientConfig(
	input: SvelteTemplateConfigurationInput
): Promise<Configuration> {
	const { env } = input;

	const baseConf: Configuration = await createConfig(input);

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
			rules: [
				tsLoaderRule({ env }),
				...await svelteLoaderRule({ env, ssr: true }),
				scssLoaderRule({ env }),
				scssModulesLoaderRule({ env }),
				fileLoaderRule(),
			],
		},
		plugins: [...plugins],
	};
}

export async function createServerConfig(
	input: SvelteTemplateConfigurationInput
): Promise<Configuration> {
	input = {
		env: {
			...input.env,
			server: true,
		},
	};

	const { env } = input;

	const baseConf: Configuration = await createConfig(input);

	return {
		...baseConf,
		entry: {
			server: config.server.entry().server.replace(/\.js$/, ".ts"),
		},
		output: config.server.output(),
		resolve: {
			...baseConf.resolve,
		},
		module: {
			rules: [
				tsLoaderRule({
					env,
				}),
				...await svelteLoaderRule({
					env,
					ssr: true,
				}),
				scssLoaderRule({
					env,
				}),
				scssModulesLoaderRule({
					env,
				}),
				fileLoaderRule(),
			],
		},
		externals: Object.keys(pkg.dependencies).concat("encoding"),
		performance: {
			hints: false, // it doesn't matter if server.js is large
		},
	};
}

export async function createServiceWorkerConfig(
	input: SvelteTemplateConfigurationInput
): Promise<Configuration> {
	const { env } = input;

	const baseConf: Configuration = await createConfig(input);

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
