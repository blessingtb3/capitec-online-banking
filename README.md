# Capitec Online Banking: Spending Insights & Loan Simulator

A responsive React + TypeScript app covering both frontend briefs as two separate pages. Each page has tabs for its features, in a grey band directly under the site header (like the product strip on Capitec's site):

| Page | URL | Tabs |
| --- | --- | --- |
| **Spending Insights** | `/spending-insights` | **Overview** (KPI tiles, spending by category as a Chart.js doughnut, and monthly budget progress shown only with the *This month* filter; picking a category opens its transactions) · **Trends** (Chart.js bar, 6/12/24 months) · **Transactions** (filter, sort, paginate) |
| **Loan Estimator** | `/loan-estimator` | **Loan products** (opens first: Personal Loan and Vehicle Finance cards stacked, with an illustration beside them on desktop and a "Check eligibility" shortcut on each) · **Eligibility** (the button unlocks once the required fields are filled; validated form → decision, likelihood, recommended loan, affordability, repayment schedule; on desktop a photo for the selected loan type sits above the estimate until the first check) · **Repayment calculator** (any amount, term and credit score; on desktop the loan type's photo sits above the result until the first calculation) |

- `/` redirects to Spending Insights, and unknown URLs show a "page not found" page.
- The active tab is kept in the URL (`?tab=transactions`), so tabs survive a refresh, can be bookmarked or shared, and work with the back button.
- Inactive tabs stay mounted, so form input and results aren't lost when you switch tabs.
- The period filter appears on the tabs that use it. On Overview it offers the preset periods only (This month, Last 7 days, Last 30 days, Last 90 days, Last year), because the summary endpoint doesn't accept custom dates; this keeps the tiles and categories on the same dates. On Transactions you can also choose a custom date range.

All data is **mocked** through RTK Query, following the API specifications exactly (see [Mock API](#mock-api)). The visual style follows Capitec's public website. This is a job-application concept and is not affiliated with Capitec Bank.

## Prerequisites

| To...                      | You need                                         |
| -------------------------- | ------------------------------------------------ |
| Run locally                | Node.js **22.13+** (24 LTS recommended) and npm  |
| Build / run in a container | Docker 20.10+ (BuildKit is on by default)        |

## Getting started (local)

```bash
npm install      # install dependencies (updates package-lock.json)
npm run dev      # start the dev server at http://localhost:5173
```

## Running with Docker

```bash
docker build -t capitec-online-banking .
docker run --rm -p 8080:80 capitec-online-banking
# open http://localhost:8080
```

The image build runs the type check and the full test suite before building, so an image is only produced from a passing codebase. To run just the tests in Docker:

```bash
docker build --target test .
```

## Scripts

| Command             | What it does                                         |
| ------------------- | ---------------------------------------------------- |
| `npm run dev`       | Start the Vite dev server with hot reload            |
| `npm run build`     | Type check, then build the production bundle into `dist/` |
| `npm run preview`   | Serve the built `dist/` locally to check it          |
| `npm run typecheck` | Run the TypeScript compiler in check-only mode       |
| `npm test`          | Run unit tests in watch mode (re-runs on save)       |
| `npm run test:run`  | Run all unit tests once (use this in CI)             |
| `npm run lint`      | Lint the code with ESLint                            |

## Seeing every state

The mock API waits 500 ms per request, so loading states are visible. To see the error states, add a query string to the URL:

| URL                              | Shows                                       |
| -------------------------------- | ------------------------------------------- |
| `/spending-insights?mockError=spending` | Every spending endpoint fails (error + retry) |
| `/loan-estimator?mockError=loans`       | The loan endpoints fail                     |

On the Eligibility tab, **Use example values** fills in the request example from the API spec.

## Project structure

```
src/
├── App.tsx / App.styles.ts       App shell: header + main nav, routes, footer
├── main.tsx                      Entry: Redux Provider, BrowserRouter, global styles
├── pages/                        One folder per URL: SpendingInsightsPage, LoanEstimatorPage, NotFoundPage
├── config/                       Routes and the signed-in customer id
├── hooks/useTabParam.ts          Active tab ⇄ ?tab= in the URL
├── theme/
│   ├── tokens.ts                 Design tokens (colours, type, spacing, radii, breakpoints)
│   └── GlobalStyle.styles.ts     Global CSS (styled-components)
├── assets/                       capitec-logo.png (header; cropped to the logo strip in Header.styles.ts)
│                                 loan.png (Loan products tab illustration; desktop only)
│                                 personal-loan.png / vehicle-loan.png (Eligibility and Repayment calculator tabs, via LoanProductImage)
├── components/                   Shared UI: Button, Card, Header, Icon, MainNav, PageShell, Tabs (+ TabPanel),
│                                 FormField, SegmentedControl, ProgressBar, StatusMessage, CategoryIcon
├── features/
│   ├── spending/                 SummaryTiles, DateRangeFilter, CategoryBreakdown,
│   │                             SpendingTrendsChart, GoalsCard, TransactionsTable
│   └── loans/                    EligibilityChecker, LoanForm, EligibilityResult, LoanProductImage,
│                                 RepaymentCalculator, RepaymentSchedule, LoanProducts
├── services/                     RTK Query: baseApi + spendingApi + loansApi
├── mocks/                        Mock backend: base query, route handlers, spec data
├── store/store.ts                Redux store (makeStore() factory for tests)
├── charts/chartSetup.ts          Chart.js registration + token-based defaults
├── types/                        API types, matching the specs
├── utils/                        Formatting, dates, loan maths, validation
└── test-utils/                   renderWithProviders()
```

### Component conventions

Every component lives in its own folder:

```
ComponentName/
├── ComponentName.tsx          markup and behaviour only
├── ComponentName.styles.ts    all styling (styled-components), built from theme tokens
└── tests/
    └── ComponentName.test.tsx
```

- **No styles in components.** Every style lives in the `.styles.ts` file and uses values from `theme/tokens.ts`. Values that come from data at runtime (a category's colour, a progress bar's width) are applied with styled-components' `.attrs`, so they still live in the styles file.
- **Plain React first.** Components use `useState` and props. There's no `useMemo`/`useCallback` for its own sake. Paging resets by remounting the transactions table with a `key` instead of syncing state in an effect.
- **Transient props.** Styling-only props start with `$` (for example `$active`), so they never reach the DOM.

### Design tokens

`src/theme/tokens.ts` holds the core palette:

| Token                      | Value     | Use                                      |
| -------------------------- | --------- | ---------------------------------------- |
| `background`               | `#FFFFFF` | Page and card background                 |
| `text`                     | `#000000` | Body text                                |
| `heading`                  | `#0133a0` | Headings                                 |
| `primaryButtonBackground`  | `#2e70ef` | Primary button background                |
| `secondaryButtonBorder`    | `#2e70ef` | Secondary button border                  |
| `buttonHoverBackground`    | `#2259d0` | Button hover background                  |

It also has supporting tokens (muted text, borders, status colours, and two accent tiles: slate and red), plus type, spacing, radii, shadows and breakpoints.

## Mock API

The UI talks to the API only through RTK Query hooks (`services/*Api.ts`). The endpoints are written exactly as they would be against a real backend, with a URL, method, params and body. The only difference is the base query: `mocks/mockBaseQuery.ts` routes each request to a handler that answers from local data.

**To switch to a real API**, replace `mockBaseQuery` with `fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL })` in `services/baseApi.ts`. Nothing else changes.

| Endpoint | Behaviour |
| --- | --- |
| `GET /api/customers/{id}/profile`, `/goals`, `/filters` | Return the spec's example responses verbatim |
| `GET .../spending/summary?period=` | Computed from the transactions for the period, compared with the previous period of equal length (`mtd` is compared with the same point last month) |
| `GET .../spending/categories?period=&startDate=&endDate=` | Computed per category; custom dates override the period; bad ranges return 400 |
| `GET .../spending/trends?months=` | Last *n* of 24 months (Jan–Jun 2024 are the spec's values); 1–24 enforced |
| `GET .../transactions?limit=&offset=&category=&startDate=&endDate=&sortBy=` | Filtered, sorted and paginated as specified |
| `GET /api/loans/products`, `/validation-rules` | The spec's example responses, verbatim |
| `POST /api/loans/eligibility` | Mock credit engine (below), validated with the same rules as the form |
| `POST /api/loans/calculate-rate` | Rate from credit score + full amortisation schedule |

**Addition to the spec:** a **This month** period (`period=mtd`). It covers the 1st of the current calendar month up to today, unlike `30d`, which is a rolling 30 days. The summary and categories endpoints accept it, and `/filters` lists it first among the presets. Its comparison is with the same point last month: 1–16 Sep is compared with 1–16 Aug.

**About the data:**
- The mock "today" is **16 Sep 2024**, matching the spec's dates.
- There are about two years of transactions. The spec's two example transactions come first; the rest are generated from a fixed seed, so the data is the same on every run.
- The generator is calibrated so the 30-day summary matches the spec closely: **R4 261.63 over 47 transactions**, against the spec's R4 250.75 over 47.
- Unknown customers return 404. You can see this by passing another id.

### Eligibility rules (illustrative, not a real credit policy)

| Step | Rule |
| --- | --- |
| Interest rate | Credit score bands placed within the product's rate range (≥750 → min, ≥650 → 25% of the range, … <450 → max). The spec example gets 12.5%. |
| Affordable repayment | 85% of disposable income (income − expenses) |
| Maximum amount | Largest loan that repayment can service over the term, rounded down to R1 000, capped at the product maximum |
| Decline when | unemployed · credit score < 500 · expenses ≥ income · repayment unaffordable · (existing debt + repayment) > 60% of income |
| Likelihood / risk | Score out of 100 from credit score, affordability headroom and employment; ≥75 low, ≥50 medium, otherwise high |

For the spec's example request, the engine returns:
- **eligible**, low risk, 83% likelihood;
- a 12.5% rate and **R7 096.10** a month (the spec shows R7 089.50);
- a maximum loan of R179 000 (the spec shows R180 000).

## Testing

Unit tests use **Vitest** (jsdom) and **React Testing Library**. As before, tests live in a `tests/` folder next to the code they cover.

- **Logic:** formatting, dates, loan maths and form validation.
- **Mock API:** every handler and the router. This covers the spec shapes, filters, pagination, sorting, validation errors and 404s.
- **Components:** each shared and feature component. Feature components run against the real mock API through a fresh Redux store (`renderWithProviders`), so the tests cover the RTK Query wiring too.
- **Pages and routing:** each page and `App` render inside an in-memory router at a given URL (`renderWithProviders(ui, { route: '/loan-estimator?tab=products' })`). This covers the redirect, the active nav link, opening a tab from the URL, cross-tab jumps, keeping input across tabs, and the not-found page.
- **Charts:** jsdom has no `<canvas>`, so `setupTests.ts` swaps the `react-chartjs-2` components for a stub. The stub exposes the plotted labels and values, so tests can still check what would be drawn.

## Accessibility

- Pages are reached through a real `<nav>` of links, and the current page is marked with `aria-current="page"`.
- Each page's tabs follow the WAI-ARIA tabs pattern, including arrow keys, Home and End.
- Each page sets its own document title.
- Form fields are labelled, with hints and errors linked through `aria-describedby`. On submit, focus moves to the first invalid field.
- Loading uses `role="status"` and errors use `role="alert"`.
- Goals and the approval likelihood are exposed as progress bars with spoken values.
- Status always pairs colour with text.
- Every chart has a text equivalent: the category list, the tooltips, and the full repayment table.
