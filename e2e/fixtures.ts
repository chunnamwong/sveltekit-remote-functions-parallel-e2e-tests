import { GenericContainer, Network, Wait } from 'testcontainers';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import type { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { test } from '@playwright/test';
import { APP_IMAGE_NAME } from './constants';

export const e2e = test.extend<
	object,
	{ base: { db: StartedPostgreSqlContainer; appUrl: string } }
>({
	base: [
		// eslint-disable-next-line no-empty-pattern
		async ({}, use) => {
			const network = await new Network().start();
			const db = await new PostgreSqlContainer('postgres:18-alpine3.23')
				.withNetwork(network)
				.withHostname('db')
				.withUsername('postgres')
				.withPassword('postgres')
				.withDatabase('svelte')
				.start();

			console.log('Creating DB tables with seed data...');
			await db.exec([
				'psql',
				'-U',
				'postgres',
				'-d',
				'svelte',
				'-c',
				"CREATE TABLE users (id BIGSERIAL PRIMARY KEY, username VARCHAR(50) NOT NULL UNIQUE, password TEXT NOT NULL); INSERT INTO users (username, password) VALUES ('user', '123456');",
			]);

			console.log('Taking DB Snapshot...');
			await db.snapshot();

			const app = await new GenericContainer(APP_IMAGE_NAME)
				.withNetwork(network)
				.withEnvironment({
					POSTGRES_URL: 'postgresql://postgres:postgres@db:5432/svelte',
					PROTOCOL_HEADER: 'REQUEST-PROTOCOL',
				})
				.withExposedPorts(3000)
				.withWaitStrategy(Wait.forLogMessage('Listening on http://0.0.0.0:3000/'))
				.start();

			const appUrl = `http://localhost:${app.getMappedPort(3000)}`;
			const workerIndex = test.info().workerIndex;

			console.log(`Worker index ${workerIndex} started hosting ${appUrl}`);
			await use({ appUrl, db });

			await app.stop();
			await db.stop();
			await network.stop();
			console.log(`Worker index ${workerIndex} stopped hosting ${appUrl}`);
		},
		{ scope: 'worker', auto: true },
	],

	page: async ({ page, base: { db, appUrl } }, use) => {
		// To make CSRF check work while keeping HTTP
		// Ref: https://github.com/sveltejs/kit/issues/14352#issuecomment-3705210391
		await page.route(`${appUrl}/**`, async (route) => {
			const request = route.request();
			await route.continue({
				headers: {
					...request.headers(),
					'REQUEST-PROTOCOL': 'http',
				},
			});
		});

		await use(page);
		console.log('Restoring from DB Snapshot...');
		await db.restoreSnapshot();
	},
});
