<script lang="ts">
	import { goto } from '$app/navigation';
	import { CurrentUser, setUser } from '$lib/stores/user';
	import { searchGame } from '../../services/game';
    import Account from '$lib/components/Game/Account.svelte';
    import Icon from '@iconify/svelte';
    import Google from '@iconify/icons-bi/google';
    import Github from '@iconify/icons-bi/github';
	import type { PageData } from '../$types';
	// import ProfileFill from '@iconify/icons-iconamoon/profile-fill';

    export let data: PageData;


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

        goto(`/game/${roomId}`);

        setUser({userId,userName});
    }

</script>

<div class="h-full w-full absolute top-0 left-0 mx-auto flex justify-center items-center">
    {#if data.user === null}
    <div class="flex flex-col items-center justify-center w-screen bg-gray-100 min-h-screen text-gray-800 p-10">
        <h1 class="text-4xl font-bold mb-10">Who wrote that</h1>
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
        <div>
            <span class="font-bold m-5">Log in</span>
        </div>
        <div class="flex justify-center">
            <form class="auth-form" method="post" action="?/OAuth2Google">
                <button class="text-5xl p-5" type="submit"><Icon icon={Google}/></button>
            </form>
            <form class="auth-form" method="post" action="?/OAuth2Github">
                <button class="text-5xl p-5" type="submit"><Icon icon={Github}/></button>
            </form>
        </div>
    </div>
    {:else}
    <div class="flex p-10 w-1/2 justify-center items-center">
        <button 
            class="rounded-lg bg-blue-500 p-2 text-white w-1/4 m-5"
            on:click={handleFindGame}
        >
            Play
        </button>
    </div>
    {#if data.user}
        <Account user={data.user}/>
    {/if}
    
    {/if}

</div>


