<script lang="ts">
	import UserGame from "$lib/components/ui/avatar/UserGame.svelte";
	import Card from "$lib/components/ui/card/card.svelte";
   import CardTitle from "$lib/components/ui/card/card-title.svelte";


    export let showWinner: boolean = false;

    export let gameData: Api.EmittedRoomData;
</script>


<ul class="flex flex-col justify-center bg-gray-100 min-h-screen ">
   <Card class="p-10 divide-gray-200 dark:divide-gray-700 divide-y">
      <CardTitle class="pb-5">Overview</CardTitle>
      {#each gameData.players as user}
      <UserGame user={{...user,roundData: gameData.gameData.data[user.userId][gameData.gameData.round]}} />
      {/each}
   </Card>

 </ul>
 