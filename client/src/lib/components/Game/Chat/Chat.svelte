<script lang="ts">
	import Message from './Message.svelte';

	let message: string;

	export let messages: App.Message[];

	const handleSendMasage = () => {
		if (message) {
			messages = [...messages, { message, isMine: true }];
			message = '';
		}
	};
</script>

<div
	class="flex h-[100px] w-full max-w-md flex-grow flex-col overflow-hidden rounded-lg bg-white shadow-xl"
>
	<div class="flex h-full w-full flex-grow flex-col space-y-4 overflow-y-auto p-4">
		{#if messages.length > 0}
			{#each messages as message}
				<Message {message} />
			{/each}
		{/if}
	</div>
	<form on:submit|preventDefault={handleSendMasage}>
		<div class="flex w-full space-x-4 p-4">
			<input
				type="text"
				class="flex-grow rounded-lg border p-2"
				placeholder="Type a message..."
				bind:value={message}
			/>
			<button class="rounded-lg bg-blue-500 p-2 text-white" on:click={handleSendMasage}>
				Send
			</button>
		</div>
	</form>
</div>
