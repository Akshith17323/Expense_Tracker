# Pocket — Expense Tracker

The base version of the personal money tracker, built with **Expo + React Native + TypeScript**.
No authentication, login, signup, or account setup. The UI follows the Basic mode of
[`app-demo.html`](app-demo.html); the approved prototype is unchanged.

## What works

- Add income and expenses with an amount, description, and editable date (today by default).
- Record UPI, Cash, or leave the payment method unset.
- Home shows total recorded expenses, income, and **recorded net**: income minus expenses.
- View all transactions newest first, with separate income and expense views.
- Tap an entry to edit it or delete it with confirmation.
- Records and pending changes persist in **SQLite on iOS/Android**, including while offline.
- The web preview persists in browser local storage.
- **Local storage is the source of truth.** Optionally upload a cloud backup to the Express API and its
  **PostgreSQL** database.
- Restore a cloud backup explicitly from Settings, with confirmation before replacing local records.

There are no categories, budgets, splits, people, savings, or ML features in this release.
Totals cover **all recorded transactions**, not just the current month. Recorded net is not a verified
bank or wallet balance. A new installation starts empty, without fictional sample transactions.

## Run the app

Use Node.js 24 LTS (`nvm use`) or a version supported by `package.json`.
From the project root:

```sh
npm install
npm run dev:mobile
```

Scan the QR code with **Expo Go**, or press `a` for Android, `i` for an iOS simulator, or `w` for web.
You can also run `npm run web` directly. The iOS simulator requires Xcode.

**No server, database, or `.env` file is needed to use the app offline.** An unavailable API does not
block adding, editing, or deleting records. The settings button shows storage and backup status.

## Optional cloud backup

The backup target is this project's **Express/PostgreSQL API**. The app does not provision a cloud
service or require an account. You can run the API on your computer or your own privately reachable
server, with PostgreSQL configured through `DATABASE_URL`.

The API stores **one latest backup** for the server-configured `LEDGER_ID`. Devices connected to the
same API replace that backup with their own complete local ledger when uploading. There is no access
control: anyone who can reach it can read or replace the backup. Use this no-auth API on a trusted
private network; CORS does not provide authentication.

Start Docker Desktop or another Docker-compatible engine, then:

```sh
cp server/.env.example server/.env
npm run db:start
npm run db:migrate
npm run dev:server
```

The Docker setup uses PostgreSQL 17 on localhost port **5433**, with a persistent named volume. Its
credentials are development-only. To use an existing PostgreSQL instance instead, set `DATABASE_URL`
in `server/.env` and run the migration command. `npm run db:stop` stops PostgreSQL without deleting data.

For a physical phone, configure the mobile API address:

```sh
cp mobile/.env.example mobile/.env
```

Set `EXPO_PUBLIC_API_URL`, including `/api/v1`:

| Device                    | API URL                                   |
| ------------------------- | ----------------------------------------- |
| iOS simulator / local web | `http://localhost:3000/api/v1`            |
| Android Studio emulator   | `http://10.0.2.2:3000/api/v1`             |
| Physical phone            | `http://YOUR_COMPUTER_LAN_IP:3000/api/v1` |

Keep the phone and computer on the same trusted network. Restart Expo after changing `.env`.
An Expo tunnel exposes Metro, not the API. `EXPO_PUBLIC_*` values are bundled into the client; never
put database credentials in them.

The API defaults to `HOST=0.0.0.0`, `PORT=3000`, and browser CORS origins
`http://localhost:8081,http://127.0.0.1:8081`. If your web preview uses another port, add its exact
origin to `CORS_ORIGINS` in `server/.env` and restart the server.

### Local-first backup behavior

- Amounts are stored as positive **integer paise**. Totals use exact integer arithmetic.
- Every change is committed locally before success is shown. Cloud availability never blocks a save.
- Pending changes trigger backup after saving, on launch, on foregrounding, and every 30 seconds
  while active. **Back up now** can also upload the current snapshot. These are foreground retries,
  not an operating-system background task; pending changes survive closing the app.
- Each upload replaces the cloud snapshot with **all active local transactions**, including their
  IDs, dates, and timestamps. The upload response contains only a backup receipt.
- Uploads never download or merge cloud records. Local revision checks keep edits made during an
  upload pending for the next backup.
- Deletions stay pending locally until a snapshot excluding those records is accepted; their local
  tombstones are then removed. Deleting the last record can back up an intentionally empty ledger.
- A fresh, empty installation cannot upload an empty backup, even manually, so an existing cloud
  backup remains available for restore.
- PostgreSQL stores a versioned JSON snapshot in `ledger_backups`. There is one latest snapshot per
  ledger, with no backup history or automatic cross-device merge.

### Restore

Open **Settings → Restore from cloud → Replace and restore**. This downloads the latest snapshot,
validates it, and atomically replaces the local ledger, including any changes not yet backed up.
The replacement cannot be undone. Cancelling, a missing/invalid backup, or a failed download/write
leaves the local records intact. Automatic uploads pause while confirmation or restoration is open;
cancelling resumes them. Editing and dismissal are blocked during restoration.

After reinstalling or clearing app/site data, open Restore before adding new records if you want to
recover the existing backup. Clearing local data removes changes that have not reached a backup.

### Upgrading from the former sync implementation

- Run **`npm run db:migrate`** against your configured PostgreSQL database before using backup.
  Migration `002_ledger_backups.sql` copies active legacy transactions into an initial snapshot for
  each ledger. It retains the original `transactions` table and its data.
- Existing phone/browser records migrate automatically on launch. Local schema version 2 preserves
  their data and revisions, marks them pending for a new backup, and clears obsolete sync timestamps.
  The browser storage key stays `pocket.ledger.v1` so saved records remain discoverable.
- The app uploads its local ledger after migration. Use explicit restore to bring back cloud-only
  data; ordinary backup does not pull it into the app.

## API

All endpoints are under `/api/v1` and require **no authorization headers**.

| Method | Endpoint  | Purpose                                                          |
| ------ | --------- | ---------------------------------------------------------------- |
| GET    | `/health` | API health                                                       |
| PUT    | `/backup` | Atomically replace the ledger's latest cloud snapshot            |
| GET    | `/backup` | Download the snapshot for explicit restore; 404 when none exists |

Example body for `PUT /api/v1/backup`:

```json
{
  "formatVersion": 1,
  "transactions": [
    {
      "id": "e1bdde69-369a-4953-a6b7-04e2dd9fd5e9",
      "type": "expense",
      "amountPaise": 20000,
      "description": "Lunch at college",
      "date": "2026-11-11",
      "paymentMethod": "UPI",
      "createdAt": "2026-11-11T09:00:00.000Z",
      "updatedAt": "2026-11-11T09:00:00.000Z",
      "deletedAt": null
    }
  ]
}
```

PUT returns `{ "data": { "backedUpAt": "<ISO timestamp>" } }`. GET returns
`{ "data": { "formatVersion": 1, "backedUpAt": "<ISO timestamp>", "transactions": [...] } }`.

Snapshots accept up to 10,000 active records, with a 5 MB request limit. IDs must be unique UUIDs;
amounts are positive integers up to 99,999,999,999 paise; descriptions are 1–70 characters; dates are
valid calendar dates between 2000 and 2099. `paymentMethod` must be `Cash`, `UPI`, or `null`.
Both timestamps are required, and `deletedAt` must be `null`. Device-only revision/pending fields
are not uploaded. Invalid uploads leave the previous snapshot intact.

Errors use `{ "error": { "code": "...", "message": "..." } }`. An unconfigured/unavailable database
returns 503 without affecting local records. The former `/transactions` endpoints are no longer routed.

## Checks and builds

```sh
npm run check
npm test
npm run build:mobile
npm run build:server
```

`npm test` covers exact arithmetic, SQLite/browser persistence and migrations, backup/retry concurrency,
atomic restore and failure rollback, and the snapshot API against an isolated **PGlite (embedded
PostgreSQL)** database. No running Docker/database is required for these tests. Mobile export checks
Android, iOS, and web bundling, not native installation.

Browser tests exercise the Expo UI, CRUD, validation, reload persistence, backup reconnection, explicit
restore, cancellation, failed restores, and fresh-install backup protection:

```sh
npx playwright install chromium
npm run test:e2e
```

With an installed Chrome, `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e` avoids downloading Chromium.
The tests start an isolated Expo web preview on port 8091 and do not use a real personal ledger.
A physical-phone smoke test in Expo Go is still recommended before relying on the app for daily records.

## Main files

- `mobile/src/screens/`: Home/Activity, transaction form, transaction details, and backup/restore settings.
- `mobile/src/domain/transactions.ts`: INR validation, formatting, dates, ordering, and totals.
- `mobile/src/storage/`: SQLite migrations and browser adapter, pending backups, and atomic replacement.
- `mobile/src/services/ledger.ts`: Local mutations, backup scheduling, and restore coordination.
- `mobile/src/services/backup.ts`: Full-snapshot upload, revision acknowledgement, and explicit restore.
- `mobile/src/services/backup-api.ts`: HTTP backup/restore adapter.
- `server/src/modules/backup/`: Routes → controller → service → PostgreSQL snapshot repository.
- `server/src/database/`: Connection lifecycle and versioned SQL migrations.
- `tests/`: Unit, database/API, storage, backup/restore, and browser end-to-end tests.

See [`FEATURES.md`](FEATURES.md) and [`BUILD_PLAN.md`](BUILD_PLAN.md) for later phases.
# Expense_Tracker
