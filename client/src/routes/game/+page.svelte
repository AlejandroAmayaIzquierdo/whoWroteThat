<script lang="ts">
	import { goto } from '$app/navigation';
	import Avatar from '$lib/components/ui/avatar/Avatar.svelte';
	import { setUser } from '$lib/stores/user';
	import { searchGame } from '../../services/game';

    let userName = '';

    const handleFindGame = async () => {
        if(!userName)
            return;
        const userId = `${userName}-${Math.random().toString(36).substring(2,9)}`;
        const resp = await searchGame(`${userName}-${Math.random().toString(36).substring(2,9)}`,userName,true);
        console.log(resp);
        if(resp.status === 0)
            return;
        const {roomId} = resp.result as Api.searchGameResult;

        setUser({userId,userName});
        
        
        goto(`/game/${roomId}`);
    }

</script>

<div class="flex flex-col items-center justify-center w-screen bg-gray-100 min-h-screen text-gray-800 p-10">
    <Avatar width={200} height={200}/>
    <div class="flex p-10 w-1/2 justify-center items-center">
        <input 
            type="text" 
            class="rounded-lg border p-2 w-1/2" 
            placeholder="Your name"
            bind:value={userName}
        />
        <button 
            class="rounded-lg bg-blue-500 p-2 text-white w-1/4 m-5"
            on:click={handleFindGame}
        >
            Play
        </button>
    </div>
</div>
