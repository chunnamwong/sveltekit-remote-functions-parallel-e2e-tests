<script lang="ts">
	import { getUserCount } from '$lib/users/data.remote';
	import { resolve } from '$app/paths';

	const userCount = $derived(await getUserCount());
</script>

<a href={resolve('/users/register')}>User Register</a>

<p>User Count: {userCount}</p>
