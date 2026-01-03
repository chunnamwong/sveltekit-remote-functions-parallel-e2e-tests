import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GenericContainer } from 'testcontainers';
import { APP_IMAGE_NAME } from './e2e/constants';

export default async function globalSetup() {
	const appPath = dirname(fileURLToPath(import.meta.url));
	await GenericContainer.fromDockerfile(appPath).build(APP_IMAGE_NAME, { deleteOnExit: false });
}
