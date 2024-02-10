<script lang="ts">
	import Message from './Message.svelte';

	let text: string;

	export let messages: App.Message[];

	const handleSendMasage = () => {
		if (text) {
			messages = [...messages, { text, isMine: true }];
			text = '';
		}
	};
</script>

<div class="flex w-full max-w-md h-[100px] flex-grow flex-col overflow-hidden rounded-lg bg-white shadow-xl">
	<div class="flex h-full w-full flex-grow flex-col space-y-4 overflow-y-auto p-4">
		{#each messages as message}
			<Message {message} />
		{/each}
	</div>
	<form on:submit|preventDefault={handleSendMasage}>
		<div class="flex w-full space-x-4 p-4">
			<input
				type="text"
				class="flex-grow rounded-lg border p-2"
				placeholder="Type a message..."
				bind:value={text}
			/>
			<button class="rounded-lg bg-blue-500 p-2 text-white" on:click={handleSendMasage}>
				Send
			</button>
		</div>
	</form>
</div>
