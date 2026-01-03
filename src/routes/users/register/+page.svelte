<script lang="ts">
	import { createUser } from '$lib/users/data.remote';
	import { resolve } from '$app/paths';
</script>

<a href={resolve('/')}>Home Page</a>

<h1>User Register</h1>

<form {...createUser}>
	<label>
		Username

		<input {...createUser.fields.username.as('text')} />

		{#each createUser.fields.username.issues() as issue (issue.message)}
			<br />
			<span>{issue.message}</span>
		{/each}
	</label>

	<br />

	<label>
		Password

		<input {...createUser.fields.password.as('password')} />
		{#each createUser.fields.password.issues() as issue (issue.message)}
			<br />
			<span>{issue.message}</span>
		{/each}
	</label>

	<br />

	<button type="submit">Register</button>
</form>
