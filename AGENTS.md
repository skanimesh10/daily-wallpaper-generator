# AGENTS.md

## Cursor Cloud specific instructions

### Product overview

Single Next.js 16 app (**Life Calendar Wallpaper**) that generates a 2026 day-grid wallpaper. No database, Docker, or `.env` files.

| Route | Purpose |
|-------|---------|
| `/` | Configurator UI (dimensions, preview, download) |
| `/days?width=&height=` | PNG wallpaper generator (Edge runtime via `next/og`) |

### Running the app

```bash
pnpm dev    # http://localhost:3000 (Turbopack)
pnpm build  # production build
pnpm start  # serve production build on port 3000
```

Use a tmux session for long-running dev servers so they survive backgrounding.

### Lint / test

- **Lint:** `pnpm run lint` — script exists but `eslint` is not listed in `package.json` devDependencies, so lint fails with `eslint: not found` until ESLint is added.
- **Tests:** none configured.

### Package manager

Prefer **pnpm** (`pnpm-lock.yaml` is present). `npm` also works via `package-lock.json`.

### Gotchas

- `pnpm install` may warn that `sharp` build scripts were ignored; the `/days` PNG route still works without it in this environment.
- `next.config.mjs` sets `typescript.ignoreBuildErrors: true`, so `pnpm build` skips type checking.
- No README or `.env.example` in the repo; all configuration is in code.
