<script lang="ts">
	import Chat from '$lib/components/Chat/Chat.svelte';
    import type { PageData } from './$types';

    const messages = [{text: "hola",isMine: true},{text: "que tal"}] as App.Message[];
    
    export let data: PageData;
</script>


<div class="bg-gray-100">
    <div class="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-100 text-gray-800 p-10">
        <Chat {messages}/>
    </div>
</div>
