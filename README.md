# Automation Exercise Playwright

A TypeScript Playwright test framework using page objects and typed fixtures for [Automation Exercise](https://automationexercise.com).

## Setup

```sh
npm install
npm run install:browsers
```

## Run tests

```sh
npm test
npm run test:smoke
npm run test:api
npm run test:chromium
npm run test:headed
npm run test:ui
npm run test:report
npm run report:allure
npm run report:allure:open
npx tsc --noEmit
```

The default UI and API URL is `https://automationexercise.com`. Override the UI URL with `PLAYWRIGHT_BASE_URL` and the API URL with `PLAYWRIGHT_API_URL`. `BASE_URL` and `API_URL` are supported as fallback variable names. Values can be loaded from a local `.env` file; see `.env.example`.

API TLS validation is strict by default. Only enable `PLAYWRIGHT_API_IGNORE_HTTPS_ERRORS=true` in a local environment that intercepts HTTPS with a certificate Node.js does not trust; do not enable it in CI or production-targeted tests.

Page objects live in `src/pages`, shared fixtures in `src/fixtures`, API clients and response contracts in `src/api`, and specs in `tests`. API specs use the `*.api.spec.ts` suffix and run in a separate Playwright project. Runtime configuration is centralized in `src/config/env.ts`.

## Coverage

- Home page title and primary navigation
- Product catalog visibility and product search
- Product details, selected cart quantity, and calculated total
- Invalid login credentials
- Product and brand API contracts, plus data-driven product search

Each test uses an isolated browser context and does not depend on a shared account.

## Reports and CI

Playwright HTML output is written to `playwright-report`. Allure results are written to `allure-results`; generate and open the report with the scripts above. Allure CLI report generation requires Java. GitHub Actions runs the API and Chromium projects and uploads Allure results/reports and failure diagnostics.

JIRA reporting is optional and disabled by default. Enable it with `JIRA_ENABLED=true` and provide the values in `.env.example` through local environment variables or GitHub secrets. JIRA reporting failures are logged without changing the test result.
