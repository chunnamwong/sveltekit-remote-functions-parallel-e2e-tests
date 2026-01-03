# sveltekit-remote-function-e2e-tests

An isolated, parallel E2E testing setup for a SvelteKit app using Remote Functions and Bun.
Each test case runs against its **own dedicated PostgreSQL database**, so tests can run concurrently without cross-test interference.

## What this repo demonstrates

- **Parallel E2E execution** without flaky shared state
- **Per-test database isolation** (a fresh DB per test case)
- A minimal SvelteKit app using **Remote Functions**
- A test runner workflow powered by **Bun** and **Docker Compose**

## Prerequisites

- [Bun](https://bun.sh/)
- [Docker](https://www.docker.com/) (or a compatible container runtime, e.g. Podman)

## Running the tests

Run the full E2E suite:

```sh
bun run test
```

Notes:

- The first run may take longer because Docker images need to be built and dependencies pulled.
- Tests are designed to run in parallel; database state is isolated per test case.

## Local development

### Start PostgreSQL (via Docker)

```sh
docker compose up db
```

### Configure environment variables

Create a `.env.local` file:

```env
POSTGRES_URL=postgresql://postgres:postgres@localhost:5432/svelte
```

### Start the dev server

```sh
bun run dev
```
