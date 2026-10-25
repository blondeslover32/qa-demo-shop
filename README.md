# QA fallback shop

This is the final plan's local Next.js fallback after EverShop Gate 1 failed. Latest EverShop still shows the correct cart count when both historical #742 response fixes are reverted. Upstream control revision: `evershopcommerce/evershop` main `f33f72cd02bc20fd5d9b2b111bdda46b79b77200`. This standalone synthetic shop is not an upstream EverShop fork or a historical detection metric.

Three fixed sample products, persistent browser cart, US standard shipping ($5), COD, optional order note, and browser-local demo order confirmation. No DB, external service, API key, payment, or AI call is needed. This is clearly labeled as a fallback/demo, not an upstream release or a real shop.

```sh
cd qa-demo-shop
npm ci
npm run lint
npm run build
npm run start -- --port 3000
```

Routes: `/` catalog, `/cart`, `/checkout`. Cart storage key `qa-fallback-cart-v1`; latest demo order `qa-fallback-last-order`. Fresh Playwright contexts provide a clean cart. Source data is in `lib/catalog.ts`; `lib/store-settings.ts` explicitly enables notes. Prices use integer cents. Three product images are copied from upstream seeded assets and attributed in `public/products/ATTRIBUTION.md`.

## Handwritten browser controls

Install the already-approved Playwright runtime without changing the app dependency manifest:

```sh
npm install --no-save --package-lock=false playwright@1.59.1
npx playwright install chromium
QA_START_STORE=1 npx playwright test --repeat-each=2
```

The config starts and tears down the production app on port 3100. To test a server already running, omit `QA_START_STORE` and set `BASE_URL`. Tests cover desktop 1280×900 and mobile 390×844. The same test code runs unchanged against both replays.

Baseline result: **12 passed**. Each regression check executes twice at each width. The note check enters an order note, completes a COD demo order with shipping, and verifies the saved note/total/payment in browser storage. Reports: `artifacts/results.json`; screenshots/traces: `test-results/`; product screenshots: `artifacts/products-desktop.png` and `products-mobile.png`.

## Isolated source regressions

Create each copy from a clean baseline. The helper refuses existing targets and copies dependencies because Turbopack disallows a node_modules symlink outside its project root.

```sh
node copy-replay.mjs 742 /tmp/qa-fallback-742
cd /tmp/qa-fallback-742
npm run build
QA_START_STORE=1 BASE_URL=http://localhost:3101 npx playwright test --repeat-each=2
```

Expected: exit 1; **four #742 failures, eight controls pass**. `lib/cart-count.ts` counts unique lines rather than total units, so adding three cups shows cart count 1. The checkout-note test stays green.

```sh
cd /path/to/qa-demo-shop
node copy-replay.mjs 955 /tmp/qa-fallback-955
cd /tmp/qa-fallback-955
npm run build
QA_START_STORE=1 BASE_URL=http://localhost:3102 npx playwright test --repeat-each=2
```

Expected: exit 1; **four #955 failures, eight controls pass**. `components/order-note.tsx` renders nothing while `showShippingNote` remains enabled. The cart test stays green. These are source changes, not URL parameters or UI switches. `prepare-replay.mjs` requires the marker placed by the copy helper; it refuses the baseline.

Measured local durations: baseline 5.9s, #742 control 26.8s, #955 control 25.1s. These are handwritten Playwright results, not runner/brain integration or a historical EverShop detection metric.

The default branch is `baseline`. Isolated branches `replay/742` and `replay/955` carry the two source regressions; neither belongs on the clean baseline before its demo gate. CI workflows and platform integration are maintained separately. No live Actions/AI/alert result or deployment is claimed. Preserve the baseline until Gate 3; #955 planting belongs after the agreed gate order. CI and runner implementation remain in their own lanes.

## Running it locally

1. `npm ci`
2. `npm run dev`, then open http://localhost:3000

Orders are demo only and stay in your browser; no payment is ever taken.
