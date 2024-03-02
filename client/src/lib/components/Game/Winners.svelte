<script lang="ts">
	import { goto } from "$app/navigation";
	import UserGame from "../ui/avatar/UserGame.svelte";

    export let gameData: Api.EmittedRoomData;
	let redirectTime = 10;

    $: {
		if(gameData?.gameData.state === 'winners') {
			if(redirectTime === 10) {
				setInterval(hadleRedirect, 1000);
			}
		}
	}

	const hadleRedirect = () => {
		redirectTime--;
		if(redirectTime === 0) {
			goto('/game');
		}
	}
	$: winnerUser = gameData.players.find((user) => user.userId === gameData.gameData.winner) ?? null;
</script>


<div class="flex flex-col items-center justify-center w-full min-h-screen  text-gray-800 p-10">
	{#if winnerUser !== null}
    <h1 class="text-4xl font-bold">Winner</h1>
	<UserGame user={{...winnerUser, roundData: gameData.gameData.data[winnerUser.userId][gameData.gameData.round]}} />
	{:else}
	<h1 class="text-4xl font-bold">No Winner</h1>
	{/if}
    <span>Redirecting to game in {redirectTime} seconds</span>
</div>