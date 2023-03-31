# NX Jest Playwright

A plugin to run jest-playwright e2e tests in nx monorepo.
It works similarly to cypress runner in a sense that you can pass either `devServerTarget` or `baseUrl`.

## ⚠️ Deprecation Notice ⚠️

Just like `jest-playwright-preset` we recommend the official [Playwright test-runner (@playwright/test)](https://playwright.dev/docs/test-intro) via **[@ns3/nx-playwright](https://www.npmjs.com/package/@ns3/nx-playwright)**.

We will continue to support this package as long as it remains compatible with `@nrwl/jest` package and `jest-playwright-preset` is supported.

## Install

```
npm i -D @ns3/nx-jest-playwright
```

## Generate

```
nx generate @ns3/nx-jest-playwright:project my-desktop-e2e --project my-destkop
```

Providing `project` flag will generate a config that targets this frontend application.

## Run project

```
nx run my-desktop-e2e:e2e
```

You may use flag specified for that runner. Most notable:
* `--watch`
* `--slowMo 1000` - so that you can see what is happening.
* `--headless false` - will start browser.
* `--devtools` - just like headless but will also open devtools (works only in chrome).

