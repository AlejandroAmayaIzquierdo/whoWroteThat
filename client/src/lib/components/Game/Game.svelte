﻿<script lang="ts">
    import { CurrentUser } from '$lib/stores/user';
	import Chat from "./Chat/Chat.svelte";

    export let gameData: Api.EmittedRoomData;
    export let onSendMessage: (message: string) => void;


    let messages = [] as App.Message[];

    $: {
        if ($CurrentUser?.userId && gameData.gameData.data[$CurrentUser?.userId] && gameData.gameData.data[$CurrentUser?.userId][gameData.gameData.round]) {
            messages = [...gameData.gameData.data[$CurrentUser?.userId][gameData.gameData.round].messages];
            // console.log(messages);
        }
    }
</script>

<div class="flex justify-center ">
    <div class="flex flex-col items-center justify-center w-1/2 min-h-screen  text-gray-800 p-10">
        <Chat {onSendMessage} {messages}/>
    </div>
    <div class="flex flex-col items-center justify-center w-1/2 min-h-screen  text-gray-800 p-10">
        <span class="text-4xl font-bold">Round {gameData.gameData.round}</span>
        <span>Time left {gameData.gameData.timeLeft}</span>
    </div>
</div>