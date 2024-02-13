<script lang="ts">
	import Chat from "./Chat/Chat.svelte";

    export let gameData: Api.EmittedRoomData;
    import { CurrentUser } from '$lib/stores/user';


    let messages = [] as App.Message[];

    $: {
        if ($CurrentUser?.userId && gameData.gameData.data[$CurrentUser?.userId] && gameData.gameData.data[$CurrentUser?.userId][gameData.gameData.round]) {
            messages = [...gameData.gameData.data[$CurrentUser?.userId][gameData.gameData.round].messages];
            console.log(messages);
        }
    }
</script>

<div class="flex justify-center bg-gray-100">
    <div class="flex flex-col items-center justify-center w-1/2 min-h-screen  text-gray-800 p-10">
        <Chat {messages}/>
    </div>
    <div class="flex flex-col items-center justify-center w-1/2 min-h-screen  text-gray-800 p-10">
        <span>Time left</span>
    </div>

</div>