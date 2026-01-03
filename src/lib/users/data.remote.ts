import * as v from 'valibot';
import { redirect, invalid } from '@sveltejs/kit';
import { query, form } from '$app/server';
import { sql } from '$lib/sql';

export const getUserCount = query(async () => {
	const [{ count }] = await sql`SELECT COUNT(*) FROM users;`;
	return count;
});

export const createUser = form(
	v.object({
		username: v.pipe(v.string(), v.nonEmpty()),
		password: v.pipe(v.string(), v.nonEmpty()),
	}),
	async ({ username, password }, issue) => {
		const [{ count }] = await sql`SELECT COUNT(*) FROM users WHERE username = ${username};`;

		if (count !== 0n) {
			invalid(issue.username('Username has been taken.'));
		}

		// TODO: In real case, we would always encrypt the password before storing to the database!
		const encryptedPassword = password;

		await sql`INSERT INTO users (username, password) VALUES (${username}, ${encryptedPassword});`;

		redirect(303, `/`);
	},
);
