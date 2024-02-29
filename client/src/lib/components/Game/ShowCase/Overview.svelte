<script lang="ts">
	import UserGame from "$lib/components/ui/avatar/UserGame.svelte";

    export let showWinner: boolean = false;

    export let gameData: Api.EmittedRoomData;
</script>


<ul class="w-full h-full divide-y divide-gray-200 dark:divide-gray-700">
   {#each gameData.players as user}
      <UserGame user={{...user,roundData: gameData.gameData.data[user.userId][gameData.gameData.round]}} />
   {/each}
 </ul>
 