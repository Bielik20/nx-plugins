# NX Serverless

A simple plugin for running sls commands in nx monorepo.
It executes serverless commands in specific app directory.
It is configured to support nx cache out of the box for build and deploy commands.

## Install

```
npm i -D @ns3/nx-serverless
```

## Generate

### `serverless-bundle`

Default plugin used in generation is [`serverless-bundle`](https://www.npmjs.com/package/serverless-bundle).
It supports all providers, nx cache as far as output of serverless bundle is concerned, but it doesn't work with incremental builds.

```
nx generate @ns3/nx-serverless:app my-app-name
```

### `@ns3/nx-serverless/plugin`

You can opt in to use experimental `@ns3/nx-serverless/plugin`.
It supports only `aws` as a provider, but works both with nx cache and incremental build.
It uses `@nrwl/webpack:webpack` executor to compile the code.
It also means that it will respect `target` you set in `tsconfig.json`.
You can use `externalDependencies` option of `build` target to exclude certain dependencies from the bundle (like aws sdk).

```
nx generate @ns3/nx-serverless:app my-app-name --plugin @ns3/nx-serverless/plugin
```

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
nx run my-app-name:sls --command logs
nx run my-app-name:sls --command 'invoke local'
```

All arguments are forwarded. 
If there is an argument that conflicts with Nx or this executor simply suffix it with `_`.
For example:

- instead of `--help`
- use `--help_`
