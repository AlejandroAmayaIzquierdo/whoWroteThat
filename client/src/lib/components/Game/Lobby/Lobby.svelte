<script lang="ts">
	import { CurrentUser } from "$lib/stores/user";
	import Avatar from "../../ui/avatar/Avatar.svelte";
	import SecretCode from "./SecretCode.svelte";

    export let gameData: Api.EmittedRoomData | null;

    export let roomID: string;

    // $: {
    //     console.log(gameData);
    // }
</script>


<div class="flex flex-row flex-wrap justify-center  min-h-screen checkered">
    <div class="flex flex-col items-center justify-start w-1/2  text-gray-800 p-10">
        <h1 class="text-4xl font-bold text-blue-400">Lobby</h1>
        <div class="flex flex-col items-center justify-center w-full text-gray-800">
            <span class="text-blue-400 font-bold">Players</span>
            <span class="text-blue-500 ">{gameData ? gameData.players.length : 0}/2</span>
            <div class="flex flex-row items-center flex-wrap justify-center w-full h-full text-gray-800 rounded-2xl shadow-sm bg-white mt-5">
                {#if gameData !== null && gameData.players.length > 0}
                    {#each gameData.players as player}
                        <div class="flex flex-col items-center justify-center p-5">
                            <Avatar user={player} height={100} width={100}/>
                            <span style="margin-top: 5px;" class="text-blue-400">{player.userName} {player.userId === $CurrentUser?.userId ? "(you)" : ""}</span>
                        </div>
                    {/each}
                {/if}
            </div>
        </div>
    </div>
    <div class="flex flex-col items-center justify-center w-1/2 min-w-fit  text-gray-800 p-10">
        <div class="flex flex-grow flex-col w-full overflow-hidden rounded-2xl shadow-sm bg-white p-10">
            <h1 class="text-4xl font-bold">Who wrote that</h1>
            
            {#if gameData?.isPrivate}
                <SecretCode secretKey={roomID}/>
            {/if}


            {#if gameData && gameData.players.length === 2}
                <span>The game will start in a moment</span>
            {:else}
                <span>Waiting for players</span>
            {/if}

        </div>
        
        
    </div>
</div>
