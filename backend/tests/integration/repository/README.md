# Repository integration tests

Place database repository tests here. These tests are excluded from `bun run test`
and run only through `bun run test:db` against an explicitly configured test database.
They must never run destructive migrations.
