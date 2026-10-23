# Children's App

An AI-powered storytelling application for children aged 1–2, focused on safe, educational, and interactive storytelling experiences.

## Current project structure

This repository is currently set up as a backend-first project scaffold with the following structure:

- `backend/` — Fastify + Bun backend service
- `docs/roadmap.md` — week-by-week development plan
- `compose.yaml` — canonical local PostgreSQL environment
- `dbmate.yml` — legacy/unreferenced local file; the canonical migration command uses CLI flags
- `.env.example` — environment variable template
- `.gitignore` — project ignore rules

## Project goal

Build a safe, interactive and educational storytelling experience for young children.

Create a child-friendly storytelling app that combines:

- AI-generated stories
- Swedish voice narration via ElevenLabs
- Personalized child experiences
- Safe content generation and simple UX for early learners
- A backend that supports stories, settings, and future frontend integration

## Main features

- Swedish AI storytelling voice using ElevenLabs
- Personalized stories using the child's name
- Speech interaction between the child and the app
- Backend API and database
- Parent settings and child profile management

## Team

- Project lead: Repository owner
- Collaborator 1: Backend development
- Collaborator 2: AI voice and speech interaction
- Collaborator 3: Frontend and integration

## Tech stack

- Runtime: Bun
- API framework: Fastify
- Database: PostgreSQL
- Migrations: dbmate
- Containerization: Docker
- AI voice: ElevenLabs

## Week-by-week roadmap

### Week 1

- Project setup
- Fastify + Bun
- PostgreSQL setup
- dbmate migration setup
- Docker configuration
- ElevenLabs integration
- First API endpoints
- Ready for Week 2

### Week 2

- API development
- Frontend integration
- Bug fixing
- Testing
- Project demo (2 November)

## Development status

- [x] GitHub repository created
- [x] Team invitations accepted
- [ ] Technical architecture agreed
- [ ] Backend initialized
- [ ] Frontend connected to backend
- [ ] Testing and security review
- [x] Repository created
- [x] Project plan documented
- [x] Local PostgreSQL configuration added
- [x] dbmate migration configuration started
- [x] Docker setup scaffolded
- [ ] Fastify + Bun backend scaffold completed
- [ ] ElevenLabs integration prototype implemented
- [ ] First API endpoints implemented
- [ ] Frontend integration started
- [ ] Testing and final demo preparation

## Local setup

Prerequisites: Bun 1.4.3, Docker with Compose, and dbmate.

Run configuration and database commands from the repository root:

```bash
Copy-Item .env.example .env
docker compose -f compose.yaml up -d
dbmate --migrations-dir db/migrations up
```

Validation status in this audit environment:

- `docker compose -f compose.yaml config` — **VERIFIED**
- `dbmate --migrations-dir db/migrations up` — **UNVERIFIED** (`dbmate` unavailable; no migration was run)

The canonical local database variables are `POSTGRES_DB`, `POSTGRES_USER`, and
`POSTGRES_PASSWORD`. `DATABASE_URL` is retained for dbmate and the planned
database-client consolidation. Keep these values pointed at the same database.

Run backend commands from `backend/`:

```bash
bun install --frozen-lockfile
bun run dev
bun run start
bun run typecheck
```

`dev` watches for changes; `start` is the non-watch entry point. From `backend/`,
run the deterministic unit and Fastify HTTP injection tests, type-check, or collect
coverage with:

```bash
bun run test
bun run typecheck
bun run test:coverage
```

Database integration tests, end-to-end tests, and the real ElevenLabs provider
smoke check are explicitly opt-in and excluded from the default test command. See
`backend/README.md` for their scope and invocation requirements.

`docker-compose.yml`, when present locally, is a non-canonical legacy/local
configuration and is intentionally not used by these instructions. The active
database/configuration modules are also duplicated (`backend/db.ts`,
`backend/src/db.ts`, and `backend/config.ts`); they will be consolidated in the
next architecture step rather than changed as part of this baseline.

## Security

Never commit API keys, passwords, access tokens, or sensitive personal data to this repository.

## Collaboration

Create a branch for each task, make changes in that branch, and use pull requests to review work before merging it.
