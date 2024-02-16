<script lang="ts">
	import { goto } from "$app/navigation";

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
</script>


<div class="flex flex-col items-center justify-center w-full min-h-screen  text-gray-800 p-10">
    <h1 class="text-4xl font-bold">Winners</h1>
    <span>Redirecting to game in {redirectTime} seconds</span>
</div>