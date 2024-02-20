<script lang="ts">
	import Icon from '@iconify/svelte';

	import Eye from '@iconify/icons-iconamoon/eye-bold';

	export let secretKey: string;

	$: hideKey = secretKey.replace(/./g, '*');

	let showKey = false;
</script>

<div>
	<div class="flex items-center justify-center">
		<h1 class="p-2 font-bold">Lobby code</h1>
		<button
			on:click={() => {
				showKey = !showKey;
			}}
		>
			<Icon icon={Eye} style="cursor: pointer; margin: 5px;" />
		</button>
	</div>

	{#if showKey}
		<h2>{secretKey}</h2>
	{:else}
		<h2>{hideKey}</h2>
	{/if}
</div>
