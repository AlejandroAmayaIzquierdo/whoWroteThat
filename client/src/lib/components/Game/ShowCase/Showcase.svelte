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
	<Overview gameData={gameData} />
</div>
