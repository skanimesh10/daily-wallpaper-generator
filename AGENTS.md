# AGENTS.md

## Cursor Cloud specific instructions

### Product overview

Single Next.js 16 app (**Life Calendar Wallpaper**) that generates a 2026 day-grid wallpaper. No database, Docker, or `.env` files.

| Route | Purpose |
|-------|---------|
| `/` | Configurator UI (dimensions, preview, download) |
| `/days?width=&height=` | PNG wallpaper generator (Edge runtime via `next/og`) |
| `/goal?title=&start=&days=` or `&end=` | Goal countdown PNG (custom date range or duration) |

### Running the app

```bash
pnpm dev    # http://localhost:3000 (Turbopack)
pnpm build  # production build
pnpm start  # serve production build on port 3000
```

Use a tmux session for long-running dev servers so they survive backgrounding.

### Goal wallpaper API

`GET /goal` query params:

| Param | Required | Description |
|-------|----------|-------------|
| `title` | No | Goal label shown on wallpaper (default: "My Goal") |
| `start` | No | Start date `YYYY-MM-DD` (default: today) |
| `end` | One of `end` or `days` | End date `YYYY-MM-DD` |
| `days` | One of `end` or `days` | Duration in days from start |
| `width`, `height` | No | Image dimensions (default: 1179×2556) |

Examples:

```
/goal?title=Learn%20Spanish&days=60
/goal?title=Ship%20MVP&start=2026-08-01&end=2026-12-31
```

### Lint / test

- **Lint:** `pnpm run lint` — script exists but `eslint` is not listed in `package.json` devDependencies, so lint fails with `eslint: not found` until ESLint is added.
- **Tests:** none configured.

### Package manager

Prefer **pnpm** (`pnpm-lock.yaml` is present). `npm` also works via `package-lock.json`.

### Gotchas

- `pnpm install` may warn that `sharp` build scripts were ignored; the `/days` PNG route still works without it in this environment.
- `next.config.mjs` sets `typescript.ignoreBuildErrors: true`, so `pnpm build` skips type checking.
- No README or `.env.example` in the repo; all configuration is in code.
