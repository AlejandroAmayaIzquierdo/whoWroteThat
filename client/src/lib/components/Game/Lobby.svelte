<script lang="ts">
	import Avatar from "../ui/avatar/Avatar.svelte";

    export let gameData: Api.EmittedRoomData | null;

    // $: {
    //     console.log(gameData);
    // }
</script>


<div class="flex flex-row flex-wrap justify-center bg-gray-100 min-h-screen">
    <div class="flex flex-col items-center justify-start w-1/2  text-gray-800 p-10">
        <h1 class="text-4xl font-bold">Lobby</h1>
        <div class="flex flex-col items-center justify-center w-full text-gray-800">
            <span>Players</span>
            <span>{gameData ? gameData.players.length : 0}/2</span>
            <div class="flex flex-row items-center flex-wrap justify-center w-full h-full text-gray-800 rounded-2xl shadow-sm bg-white mt-5">
                {#if gameData !== null && gameData.players.length > 0}
                    {#each gameData.players as player}
                        <div class="flex flex-col items-center justify-center p-5">
                            <Avatar user={player} height={100} width={100}/>
                            <span style="margin-top: 5px;">{player.userName}</span>
                        </div>
                    {/each}
                {/if}
            </div>
        </div>
    </div>
    <div class="flex flex-col items-center justify-center w-1/2 min-w-fit  text-gray-800 p-10">
        <div class="flex flex-grow flex-col w-full overflow-hidden rounded-2xl shadow-sm bg-white p-10">
            <h1 class="text-4xl font-bold">Who wrote that</h1>
            {#if gameData && gameData.players.length === 2}
                <span>The game will start in a moment</span>
            {:else}
                <span>Waiting for players</span>
            {/if}

        </div>
        
        
    </div>
</div>
