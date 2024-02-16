<script lang="ts">
	import Chat from './Chat/Chat.svelte';
    import { AngleUpOutline, AngleDownOutline } from 'flowbite-svelte-icons';

	export let gameData: Api.EmittedRoomData;

	$: actualData = gameData
		? gameData.gameData.data[gameData.gameData.showCasingUser][gameData.gameData.round]
		: null;

	$: isAnswer = actualData?.answer ? true : false;

	const handleVote = (vote: number) => {
		console.log(vote);
	};
</script>

<div class="flex justify-center bg-gray-100">
	<div class="flex min-h-screen w-1/2 flex-col items-center justify-center p-10 text-gray-800">
		{#if actualData}
			<span class="text-4xl font-bold"
				>Chat of {gameData.players.find((e) => e.userId === gameData.gameData.showCasingUser)
					?.userName}</span
			>
			{#if isAnswer}
				<Chat
					isDisabled
					messages={[...actualData.messages, { message: actualData.answer + '', isMine: true }]}
				/>
			{:else}
				<Chat isDisabled noAwnser messages={actualData.messages} />
			{/if}
		{/if}
	</div>
	<div class="flex min-h-screen w-1/2 flex-col items-center justify-center p-10 text-gray-800">
		<span class="text-4xl font-bold">Round {gameData.gameData.round}</span>
		<div class="flex justify-center">
			<button class="p-5" on:click={() => handleVote(1)}><AngleUpOutline /></button>
			<button class="p-5" on:click={() => handleVote(-1)}><AngleDownOutline /></button>
		</div>
		<span>Time left {gameData.gameData.timeLeft}</span>
	</div>
</div>
