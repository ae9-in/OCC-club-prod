# OCC CI/CD

OCC uses a split deployment model:

- frontend: Next.js app in `occ/frontend`
- backend: Express + Prisma API in `occ/backend`
- backend infrastructure blueprint: `render.yaml`

## Workflows

- `.github/workflows/ci.yml`
  - path-aware validation for frontend and backend
  - skips unrelated jobs on small changes
  - validates frontend route contracts for critical OCC pages and workflows
  - validates Prisma schema application against CI Postgres before backend tests
  - restores Next build cache to keep repeated frontend validation practical
- `.github/workflows/deploy.yml`
  - triggers deploy hooks only for the app that changed
  - supports `develop` for staging and `main` for production

## Why this setup

- keeps CI fast by avoiding duplicate database-only workflows
- uses `npm ci` and setup-node caching for reproducible installs
- validates the frontend with lint, type-check, and build
- validates critical frontend route contracts like About, Feeds, Dashboard, Admin, Apply, and Club submission screens
- validates the backend with Prisma generate/validate, schema deploy against CI Postgres, DB health check, type-check, and tests
- protects the current club approval model so approved clubs stay public, new clubs stay pending, and the removed verified-club concept does not regress back into the UI
- protects the gig application moderation flow, applicant detail serialization, and approved-gig access contract used by the dashboard
- avoids adding Docker, Kubernetes, or heavy end-to-end jobs the repo is not currently using

## Required GitHub secrets

For frontend hook deploys:

- `VERCEL_DEPLOY_HOOK_STAGING`
- `VERCEL_DEPLOY_HOOK_PRODUCTION`

For backend hook deploys:

- `RENDER_DEPLOY_HOOK_STAGING`
- `RENDER_DEPLOY_HOOK_PRODUCTION`

If a hook is not configured, the deploy job logs a skip instead of failing the pipeline.

## Environment notes

- frontend public env vars stay in Vercel project settings
- backend secrets stay in Render service settings or Blueprint env settings
- do not copy backend secrets into GitHub Actions unless a workflow truly needs them

## Local parity

Frontend:

```bash
cd occ/frontend
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
```

Backend:

```bash
cd occ/backend
npm ci
npm run prisma:generate
npm run prisma:validate
npm run prisma:deploy
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:check
npm run typecheck
npm run test
```
