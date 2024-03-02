<script lang="ts">
	import UserGame from "$lib/components/ui/avatar/UserGame.svelte";
	import Card from "$lib/components/ui/card/card.svelte";
   import CardTitle from "$lib/components/ui/card/card-title.svelte";


    export let showWinner: boolean = true;

    export let gameData: Api.EmittedRoomData;

    $: winnerUser = gameData.players.find((user) => user.userId === gameData.gameData.winner) ?? null;
</script>


<ul class="flex flex-col justify-center items-center bg-gray-100 min-h-screen gap-10 w-full">
   {#if showWinner && winnerUser !== null}
   <Card class="w-1/2 h-1/2 p-10 divide-gray-200 dark:divide-gray-700 divide-y flex flex-col justify-center items-center">
      <CardTitle class="pb-5">Winner</CardTitle>
      <UserGame user={{...winnerUser, roundData: gameData.gameData.data[winnerUser.userId][gameData.gameData.round]}} />
   </Card>
   {/if}
   <Card class="w-1/3 p-10 divide-gray-200 dark:divide-gray-700 divide-y flex flex-col justify-center items-center">
      <CardTitle class="pb-5">Overview</CardTitle>
      {#each gameData.players as user}
         <UserGame user={{...user,roundData: gameData.gameData.data[user.userId][gameData.gameData.round]}} />
      {/each}
   </Card>
 </ul>
 