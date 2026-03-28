# Global Market Agent (Hackathon MVP)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

AI-powered market research demo built with Next.js + Tailwind.

## Quick Start

```bash
npm install
npm run dev
```

Open the `Local` URL printed by Next.js in terminal (usually `http://localhost:3000`).
If `3000` is occupied, Next will auto-select another port.

If hot-reload cache becomes unstable after dependency upgrades, run:

```bash
npm run dev:clean
```

## Demo Inputs

1. `Electronics` -> `wireless earbuds` + `US` + `Amazon`
2. `Home & Kitchen` -> `air fryer` + `US` + `Amazon`
3. `Home Appliances` -> `robot vacuum` + `US` + `Amazon`
4. `Office` -> `standing desk` + `US` + `Amazon`
5. `Automotive` -> `dash cam` + `US` + `Amazon`
6. `Personal Care` -> `water flosser` + `US` + `Amazon`
7. `Home & Bedding` -> `memory foam pillow` + `US` + `Amazon`
8. `Cookware` -> `cast iron skillet` + `US` + `Amazon`
9. `Sports & Fitness` -> `resistance bands` + `US` + `Amazon`
10. `Home Improvement` -> `led strip lights` + `US` + `Amazon`

## Scoring Profiles

- `Balanced`: equal focus on market proof and execution plan.
- `Aggressive`: faster go-to-market bias with lower go threshold.
- `Conservative`: stronger proof required before "Go".

## LLM Switch

By default, the API uses local mock data only.

```bash
ENABLE_LLM=false
```

Set `ENABLE_LLM=true` to enable a simulated "LLM refinement" step in `/api/analyze`.

## API Notes

- `POST /api/analyze` validates keyword length and input enums.
- Rate limit returns `429` with `Retry-After`.
- Error payload includes `error_code` and `request_id`.
- Data is benchmark mock data (directional), auto-calibrated for plausible price/rating/review ranges based on competitor anchors.

## GitHub Pages

This repo includes an automatic Pages deployment workflow:

- Workflow file: `.github/workflows/deploy-pages.yml`
- Trigger: push to `main`
- Expected URL: `https://flameaistudio.github.io/GlobalMarketAgent-CX/`

First-time setup in GitHub:

1. Open repository `Settings` -> `Pages`.
2. Set `Build and deployment` source to `GitHub Actions`.
3. Push to `main` and wait for `Deploy GitHub Pages` workflow to finish.

Pages runs in static export mode and uses the local analyzer path (no runtime API dependency).

## License

This project is licensed under the MIT License.
See [LICENSE](./LICENSE) for details.
