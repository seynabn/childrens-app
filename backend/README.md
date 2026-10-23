# Backend

Requires Bun 1.4.3.

Run all commands in this section from `backend/`.

Install dependencies:

```bash
bun install --frozen-lockfile
```

Start the development server with file watching:

```bash
bun run dev
```

Start the server without file watching:

```bash
bun run start
```

Type-check the backend:

```bash
bun run typecheck
```

Run the deterministic automated suite:

```bash
bun run test
```

The default suite contains unit tests in `tests/unit/` and Fastify injection tests
in `tests/http/`. It preloads a guard that rejects `fetch`, uses fake database and
voice dependencies, performs no real network or database calls, and closes every
Fastify app it creates. Generate a local coverage report with `bun run test:coverage`.
Coverage output is ignored by Git.

Repository integration tests belong in `tests/integration/repository/`. They are
not part of the default suite and run only with `bun run test:db` against an
explicitly configured test database. Full-system tests belong in `tests/e2e/` and
must remain explicitly opt-in.

`manual/elevenlabs-smoke.ts` is a real, paid-provider smoke check—not an automated
test. It is never discovered by `bun run test` and refuses to run unless
`RUN_ELEVENLABS_SMOKE=1` is deliberately set. It also requires the provider
credentials in the repository-root `.env` file. Run it only when a real call is
intended:

```powershell
$env:RUN_ELEVENLABS_SMOKE = "1"
bun run smoke:elevenlabs
```

The commands load environment variables from the repository-root `.env` file.

Database migrations are managed from the repository root; see the root README.
