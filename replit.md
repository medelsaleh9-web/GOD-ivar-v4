# IVAR v4 Facebook Messenger Bot

A self-hosted Facebook Messenger bot (IVAR v4) using the `fca-auto` library (custom Facebook Chat API). The bot connects via MQTT WebSocket, handles commands/events, uses SQLite for persistence, and auto-restarts on failure.

## Run & Operate

- **Start bot**: handled by the "IVAR Bot" workflow (`cd bot && node index.js`)
- Bot supervisor (`index.js`) spawns `main-loader.cjs` → `main.js` → FCA login
- `FastConfigFca.json` — key runtime settings (MQTT restart, auto-restart timers)
- `appstate.json` — Facebook session cookies (must be valid for the bot to connect)

## Stack

- Node.js 24, CommonJS modules
- `fca-auto` — custom Facebook Chat API (local library at `bot/lib/fca-auto/`)
- Express 4 — HTTP status server on port 3000
- Sequelize + sqlite3 — message/thread/user database
- MQTT WebSocket — Facebook real-time messaging connection

## Where things live

```
bot/                           — the IVAR bot (excluded from pnpm workspace)
  index.js                     — HTTP server + process supervisor (restarts main-loader.cjs)
  main.js                      — main bot logic: login, load commands/events, listen
  main-loader.cjs              — bootstraps main.js with custom module loader
  FastConfigFca.json           — FCA library config (MQTT timers, bypass settings)
  config.json                  — bot config (prefix, admin IDs, auto-create DB, etc.)
  appstate.json                — Facebook session cookies (user-provided)
  lib/fca-auto/                — Facebook Chat API library
    Extra/Database/index.js    — FCA internal session store (sync-sqlite fallback)
    Extra/Database/sync-sqlite.js — deasync+sqlite3 fallback for better-sqlite3
  includes/
    listen.js                  — message listener
    handle/
      handleCommand.js         — command dispatch
      handleEvent.js           — event dispatch
      handleRefresh.js         — thread data refresh events
      handleCreateDatabase.js  — auto-create thread/user DB entries
  modules/commands/            — bot commands
  modules/events/              — bot event handlers
artifacts/api-server/          — existing API server artifact (separate)
```

## Architecture decisions

- **Bot is outside pnpm workspace** — moved to `bot/` (not `artifacts/bot/`) to prevent pnpm from wiping its `node_modules` on workflow restarts. Listed as `!artifacts/bot` exclusion in `pnpm-workspace.yaml`.
- **sync-sqlite fallback for better-sqlite3** — `better-sqlite3` requires native compilation that can time out in this environment. A `deasync`+`sqlite3` shim (`sync-sqlite.js`) provides the same synchronous API as a fallback.
- **Exponential backoff restarts** — `index.js` uses exponential backoff (5s → 10s → 20s → ... capped at 5min) with a 10-restart cap per 5-minute window, plus 2-minute cooldown.
- **Exit code encoding** — codes 20–299 mean "restart after (code-20) seconds"; code 1 means immediate restart; code 0 means stop.
- **shell: false on child_process.spawn** — avoids shell interpretation issues with process signals.

## Product

- Facebook Messenger bot that listens to messages in groups/DMs
- Responds to commands prefixed by the configured prefix
- Auto-manages a SQLite database of threads, users, and currencies
- Supports per-thread configuration, admin controls, and event handling
- Connects via Facebook's MQTT WebSocket protocol using cookie-based auth

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- **appstate.json must be valid** — expired/invalid session cookies prevent login. Refresh from a logged-in browser session.
- **bot/node_modules is managed by npm** — do NOT run `pnpm install` in `bot/`; use `npm install --legacy-peer-deps --ignore-scripts && npm rebuild sqlite3` to install/update deps.
- **better-sqlite3 native build times out** — the sync-sqlite.js fallback handles this automatically. If better-sqlite3 ever successfully builds, it will be used preferentially.
- **MQTT restart is scheduled** — `FastConfigFca.json` RestartMQTT_Minutes=45 means the bot reconnects MQTT every 45 minutes to prevent stale connections.
- **Always run `npm rebuild sqlite3`** after a fresh `npm install` — `--ignore-scripts` skips native builds so sqlite3 must be rebuilt separately.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
