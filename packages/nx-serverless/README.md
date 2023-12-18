# NX Serverless

A simple plugin for running sls commands in nx monorepo.
It executes serverless commands in specific app directory.
It is configured to support nx cache out of the box for build and deploy commands.

## Install

```
npm i -D @ns3/nx-serverless
```

## Generate

### `serverless-esbuild`

Default plugin used in generation is [`serverless-esbuild`](https://www.npmjs.com/package/serverless-esbuild).
It supports all providers, nx cache as far as output of serverless is concerned, but it doesn't work with incremental builds.

```
nx generate @ns3/nx-serverless:app my-app-name
```

### `@ns3/nx-serverless/plugin`

> ⚠️ Warning: this plugin is experimental and can change without major version bump.

You can opt in to use experimental `@ns3/nx-serverless/plugin`.
It supports only `aws` as a provider, but works both with nx cache and incremental build.
It uses `@nx/webpack:webpack` executor to compile the code and is independent of serverless framework.
To achieve that it uses `withPatterns` plugin to find which files to compile.
It means that you need to create and follow file naming pattern for your handlers.
The default one is `'./src/handlers/**/handler.ts'`
You can use `withExternals` plugin to exclude certain dependencies from the bundle (default `/^@aws-sdk\//` excludes aws sdk in v3).

```
nx generate @ns3/nx-serverless:app my-app-name --plugin @ns3/nx-serverless/plugin
```


> Rationale: making build step independent of serverless framework allows us to cache build process.
> This means that changing serverless config won't trigger rebuild of the whole app.
> It makes it also easy to replace webpack with other bundler like rspack etc.

#### Webpack Alternative

If you want to use executor for build other than @nx/webpack you can.
The only requirement is for build executor to have `outputPath` option defined and support for `--watch` flag.
Of course, you will have to provide equivalent of `withPatterns` and `withExternals` plugins.

## Available commands

```
nx run my-app-name:package
nx run my-app-name:serve
nx run my-app-name:deploy
nx run my-app-name:remove
nx run my-app-name:lint
nx run my-app-name:test
```

## Stage

To control Serverless `stage` param you can use

### ⚠️ Flag

`--stage` flag, but that won't get forwarded to dependant tasks.

```shell
nx run my-app-name:deploy --stage my-stage
```

### ✅ Env Variable

`STAGE` env variable, `package` and `deploy` targets are configured to take it into account.
As a bonus you can use it later to also configure e2e tests for your service etc.

```shell
STAGE=my-stage nx run my-app-name:deploy
```

## Custom commands

Should you need a more specific command that is not included you can run it like:

```
nx run my-app-name:sls logs
nx run my-app-name:sls invoke local
```

All arguments are forwarded.
If there is an argument that conflicts with Nx or this executor simply suffix it with `_`.
For example:

- instead of `--help`
- use `--help_`
