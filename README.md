# OtterMeet

Landing page, host accounts and a host portal for managing sessions.

- **Frontend:** React 18 + Vite, styled with the OtterMeet design system (`src/ds/`, copied from the
  OtterMeet Design System artifact: tokens, fonts, `bundle.css` and the `window.OtterMeet` component bundle).
- **Backend:** Express 5 + Node's built-in `node:sqlite` (Node 22.5+; database at `data/ottermeet.db`).
  Passwords are hashed with scrypt; logins use an httpOnly cookie whose SHA-256 is stored server-side.

```bash
npm install
npm run dev        # http://localhost:5173 (API + Vite on one port)
npm run build && npm start   # production build served by Express
```

## Routes

| Page | Path |
| --- | --- |
| Landing | `/` |
| Sign up / Log in | `/signup`, `/login` |
| Host portal: sessions | `/portal` |
| Host portal: account | `/portal/account` |

API: `POST /api/auth/signup|login|logout`, `GET /api/auth/me`, `PATCH /api/account`,
`GET|POST /api/sessions`, `PUT|DELETE /api/sessions/:id` (all scoped to the signed-in host).

## Local test account

The local dev database was seeded during setup with `host@ottermeet.test` / `otter-test-2026`.
Delete `data/` to start fresh.

## Updating the design system

`src/ds/` is a copy. When the artifact changes, re-download `tokens.css`, `bundle.css`, `bundle.js`,
`index.d.ts` and the fonts into `src/ds/`. The bundle is a classic script that reads `window.React`,
which `src/ds/react-global.js` sets before it loads.
