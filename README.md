# Capitec Online Banking

A React single-page app built with [Vite](https://vite.dev), tested with
[Vitest](https://vitest.dev) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro),
and shipped as a Docker image served by nginx.

## Prerequisites

| To...                    | You need                                   |
| ------------------------ | ------------------------------------------ |
| Run locally              | Node.js **22.12+** (24 LTS recommended) and npm |
| Build / run in a container | Docker 20.10+ (BuildKit is on by default) |

Vite, Vitest, ESLint and the other tools are project dependencies, so nothing
needs to be installed globally.

## Getting started (local)

```bash
npm install      # install dependencies (creates/updates package-lock.json)
npm run dev      # start the dev server at http://localhost:5173
```

## Scripts

| Command            | What it does                                        |
| ------------------ | --------------------------------------------------- |
| `npm run dev`      | Start the Vite dev server with hot reload           |
| `npm run build`    | Build the production bundle into `dist/`            |
| `npm run preview`  | Serve the built `dist/` locally to check it         |
| `npm test`         | Run unit tests in watch mode (re-runs on save)      |
| `npm run test:run` | Run all unit tests once (use this in CI)            |
| `npm run lint`     | Lint the code with ESLint                           |

## Testing

Unit tests use **Vitest** with a **jsdom** browser environment and **React
Testing Library**. Matchers from `@testing-library/jest-dom` (for example
`toBeInTheDocument()`) are loaded globally in `src/setupTests.ts`, and
`describe` / `it` / `expect` are available without importing them.

### Where tests go

Every feature or component keeps its unit tests in a `tests/` folder
next to it, and each test file is named after the component it covers:

```
<ComponentName>.test.tsx
```

For example:

```
src/
├── App.jsx
├── tests/
│   └── App.test.tsx                 # tests for App
└── components/
    ├── LoginForm/
    │   ├── LoginForm.jsx
    │   └── tests/
    │       └── LoginForm.test.tsx   # tests for LoginForm
    └── AccountSummary/
        ├── AccountSummary.jsx
        └── tests/
            └── AccountSummary.test.tsx
```

Vitest only picks up files matching `src/**/tests/**/*.test.{ts,tsx,js,jsx}`
(configured in `vite.config.js`), so a test placed outside a `tests/` folder
will not run.

### Writing a test

```tsx
// src/components/LoginForm/tests/LoginForm.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '../LoginForm'

describe('LoginForm', () => {
  it('shows the sign-in button', () => {
    render(<LoginForm />)
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })
})
```

### Running tests

```bash
npm test                         # watch mode
npm run test:run                 # run once
npx vitest run LoginForm         # run only files whose path matches "LoginForm"
```

## Linting

The project uses [ESLint](https://eslint.org) (flat config in `eslint.config.js`):

- `.js` / `.jsx` app code: ESLint recommended rules, the React Hooks rules,
  and `react-refresh` (keeps hot reload working)
- `.ts` / `.tsx` files (unit tests): the same, plus
  [typescript-eslint](https://typescript-eslint.io) recommended rules and
  Vitest globals (`describe`, `it`, `expect`, ...)

```bash
npm run lint             # check
npx eslint . --fix       # auto-fix what can be fixed
```

For problems to show in your editor, install the ESLint extension (for VS Code:
`dbaeumer.vscode-eslint`).

## Docker

The `Dockerfile` is multi-stage:

1. **deps** – installs dependencies with `npm ci`
2. **test** – runs the unit tests (only built when you target it)
3. **build** – builds the production bundle with `npm run build`
4. **runtime** – serves `dist/` with nginx on port 80 (config in `nginx.conf`)

> `npm ci` installs exactly what is in `package-lock.json`, so commit an
> up-to-date lockfile. After changing dependencies, run `npm install` locally
> before building the image.

### Build the image

```bash
docker build -t capitec-online-banking .
```

### Run the container

```bash
docker run --rm -p 8080:80 --name capitec-online-banking capitec-online-banking
```

Then open <http://localhost:8080>. Stop it with `Ctrl+C` (or
`docker stop capitec-online-banking` from another terminal).

### Run the tests in Docker

```bash
docker build --target test -t capitec-online-banking:test .
```

The build fails if any test fails, so this command can be used as a CI step.
Add `--progress=plain` to see the full test output.

## Project structure

```
capitec-online-banking/
├── public/              # static files copied as-is (favicon, icons)
├── src/
│   ├── assets/          # images imported by components
│   ├── tests/           # unit tests for App
│   ├── App.jsx          # root component
│   ├── main.jsx         # entry point
│   └── setupTests.ts    # test setup (jest-dom matchers)
├── Dockerfile           # multi-stage build: deps → test → build → nginx
├── eslint.config.js     # ESLint rules
├── nginx.conf           # nginx config for the container (SPA fallback, caching)
├── vite.config.js       # Vite + Vitest config
└── tsconfig.json        # editor/type settings for .ts/.tsx test files
```
