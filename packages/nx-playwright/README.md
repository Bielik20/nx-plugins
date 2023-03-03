# NX Playwright

A plugin to run playwright e2e tests in nx monorepo.

## Install

```
npm i -D @ns3/nx-playwright
```

## Generate

```
nx generate @ns3/nx-playwright:project my-desktop-e2e --project my-destkop
```

Providing `project` flag will generate a config that targets this frontend application.

## Run project

```
npx nx run my-desktop-e2e:e2e
```

It works similarly to cypress runner in a sense that you can pass dev server options:

```ts
export interface StartDevServerOptions {
  devServerTarget?: string;
  skipServe?: boolean;
  baseUrl?: string;
  watch?: boolean; // Only affects DevServer, Playwright doesn't support it :(
}
```

With an exception that `watch` is not supported at the moment as `Playwright` doesn't have a concept of [watch/open](https://github.com/microsoft/playwright/issues/7035) like Cypress does.

`baseUrl` is passed as `BASE_URL` env variable.

Apart from that, there is a `command` option which is generated with `playwright test`.
It is done like that to allow you to replace it with different command or different runner altogether like [playwright-watch](https://www.npmjs.com/package/@deploysentinel/playwright-watch), or `playwright show-trace` etc.

```bash
npx nx run my-desktop-e2e:e2e --command "playwright show-trace"
```

This executor passes every [arg to playwright runner](https://playwright.dev/docs/test-cli#reference) including nameless ones
In case there is a name conflict between Playwright and Nx/Executor params simply suffix them with `_`:

```bash
npx nx run my-desktop-e2e:e2e app.spec.ts --debug # all args passed to Playwright
npx nx run my-desktop-e2e:e2e --help_ # help conflicts with Nx help so we pass it as help_
```
