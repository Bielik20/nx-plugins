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
It uses `@nrwl/node:build` executor to compile the code.
It also means that it will respect `target` you set in `tsconfig.json`.
You can use `externalDependencies` option of `build-base` target to exclude certain dependencies from the bundle (like aws sdk).

```
nx generate @ns3/nx-serverless:app my-app-name --plugin @ns3/nx-serverless/plugin
```

## Available commands

```
nx run my-app-name:build
nx run my-app-name:serve
nx run my-app-name:deploy
nx run my-app-name:remove
nx run my-app-name:lint
nx run my-app-name:test
```

## Custom commands

Should you need a more specific command that is not included you can run it like:

```
nx run my-app-name:sls --command logs
nx run my-app-name:sls --command 'invoke local'
```
