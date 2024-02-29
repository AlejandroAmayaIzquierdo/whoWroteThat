<script lang="ts">
	import Chat from '../Chat/Chat.svelte';
	import Overview from './Overview.svelte';

	export let gameData: Api.EmittedRoomData;

	export let onVote: (vote: number) => void;

	let vote = 0;

	export let isDisableVote = false;

	$: isGeneral = gameData.gameData.showCasingUser === 'general';

	$: {
		console.log(isGeneral);
	}

	let actualData: App.UserGameData | null = null;
	let isAnswer = false;

    $: {
        if (gameData && gameData.gameData) {
            const { round, showCasingUser, data } = gameData.gameData;
			if (showCasingUser !== 'general') { 
				const roundData = data[showCasingUser][round];
            	actualData = roundData;
			}
        } else {
            actualData = null;
        }
    }

	$: isAnswer = actualData?.answer ? true : false;

	$: {
		if(isDisableVote) {
			vote = 0;
		}
	}
</script>

<div class="flex justify-center bg-gray-100">
	{#if isGeneral}
	<Overview gameData={gameData} />
	{:else}
	<div class="flex min-h-screen w-1/2 flex-col items-center justify-center p-10 text-gray-800">
		{#if actualData}
			<span class="text-4xl font-bold p-5"
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
		<div class="m-10 flex justify-center space-x-5">
			<button
				on:click={() => {
					onVote(1);
					vote = 1;
				}}
				disabled={isDisableVote}
				class="p-2 border rounded-full hover:bg-gray-200 {isDisableVote ? "focus:outline-none disabled:opacity-50" : ""} {vote === 1 ? 'bg-gray-200 shadow-inner' : ''}"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
				</svg>
			</button>
			<button
				on:click={() => {
					onVote(-1);
					vote = -1;
				}}
				disabled={isDisableVote}
				class="p-2 border rounded-full hover:bg-gray-200 {isDisableVote ? "focus:outline-none disabled:opacity-50" : ""} {vote === -1 ? 'bg-gray-200 shadow-inner' : ''}"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>
		</div>
		<span>Time left {gameData.gameData.timeLeft}</span>
	</div>
	{/if}

</div>
