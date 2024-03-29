﻿<script lang="ts">
	import { goto } from '$app/navigation';
	import { setUser } from '$lib/stores/user';
	import { joinGame, searchGame } from '../../services/game';
    import Account from '$lib/components/Game/Account.svelte';
    import Icon from '@iconify/svelte';
    import Google from '@iconify/icons-bi/google';
    import Github from '@iconify/icons-bi/github';
    import Twitch from '@iconify/icons-bi/twitch';
	import type { PageData } from '../$types';
	import { Toaster, toast } from 'svelte-sonner';
	import PrivateLobbyPopover from '$lib/components/Game/Lobby/PrivateLobbyPopover.svelte';

    export let data: PageData;


    let userName = '';

    const MIN_WIDTH_MOBILE = 800;
    

    $: innerWidth = 0
    $: innerHeight = 0

    $: {
        if (innerWidth < MIN_WIDTH_MOBILE) {
            toast.info('The game its better played on desktop')
        }
    }

    const handleFindAnonymousGame = async (isPrivate?: boolean) => {
        if(!userName)
            return;
        const userId = `${userName}-${Math.random().toString(36).substring(2,9)}`;
        const resp = await searchGame(`${userName}-${Math.random().toString(36).substring(2,9)}`,userName,isPrivate ?? false);
        if(resp.status === 0)
            return;
        const {roomId} = resp.result as Api.searchGameResult;

        goto(`/game/${roomId}`);

        setUser({userId,userName});
    }

    const handleFindGame = async (isPrivate?: boolean) => {
        if(!data.user?.userId) return;
        console.log(data.user.profileName)
        const userName = data.user?.profileName ?? data.user?.userName ?? data.user?.userId;
        const resp = await searchGame(data.user.userId,userName,isPrivate ?? false);
        if(resp.status === 0) {
            toast.error(`Error finding game`);
            return;
        }
            
        const {roomId} = resp.result as Api.searchGameResult;

        goto(`/game/${roomId}`);

        // console.log(data.user);

        setUser(data.user);
    }

    const handleJoinLobby = async (lobby: string) => {
        if(!data.user?.userId) return;
        const resp = await joinGame(lobby);
        if(resp.status === 0) {
            toast.error(`Error finding game '${resp.error}'`);
            return;
        }
        const {roomId} = resp.result as Api.searchGameResult;

        goto(`/game/${roomId}`);

        setUser(data.user);
    }


</script>

<svelte:window bind:innerWidth bind:innerHeight/>

<Toaster richColors />

<div class="h-full w-full absolute top-0 left-0 mx-auto flex flex-col justify-between items-center checkeredAnimated">
    <h1 class="text-6xl font-extrabold text-blue-400 
        uppercase drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] pt-20 pb-10
        text-center">
        Who whrote That!
    </h1>
    {#if data.user === null}
        <div class="flex flex-col items-center justify-center w-screen h-full text-gray-800">
            <div class="flex w-full max-w-screen-sm justify-center items-center pl-5 pr-5 pb-2">
                <input 
                    type="text" 
                    class="rounded-lg border p-2 w-full" 
                    placeholder="Your name"
                    bind:value={userName}
                />
                <button 
                    class="rounded-lg bg-blue-500 p-2 text-white w-1/4 ml-5"
                    on:click={() => handleFindAnonymousGame(false)}
                >
                    Play
                </button>
            </div>
            <div class="flex w-full max-w-screen-sm justify-center items-center">
                <button 
                class="rounded-lg bg-blue-500 p-2 text-white w-full ml-5 mr-5"
                on:click={() => toast.error('To play private you need to log in')}
            >
                Private lobby
            </button>
            </div>
            <div class="pt-20">
                <span class="font-bold m-5 text-blue-500">Log in</span>
            </div>
            <div class="flex justify-center">
                <form class="auth-form" method="post" action="?/OAuth2Google">
                    <button class="text-5xl p-5 text-blue-500" type="submit"><Icon icon={Google}/></button>
                </form>
                <form class="auth-form" method="post" action="?/OAuthGithub">
                    <button class="text-5xl p-5 text-blue-500" type="submit"><Icon icon={Github}/></button>
                </form>
                <form class="auth-form" method="post" action="?/OAuthTwitch">
                    <button class="text-5xl p-5 text-blue-500" type="submit"><Icon icon={Twitch}/></button>
                </form>
            </div>
        </div>
    {:else}
    <div class="flex w-full h-1/2 p-5 {innerWidth <= MIN_WIDTH_MOBILE ? 'flex-col gap-20 items-center' : 'flex-row gap-40 items-end'}  justify-center content-center"  >
        <button 
            class="inline-flex items-center justify-center rounded-xl bg-white px-4 py-3
            font-medium leading-none text-blue-400 shadow-md hover:opacity-75 w-full 
            hover:brightness-[1.01] active:scale-90 transition-all active:brightness-[0.99]"
            on:click={() => handleFindGame(false)}
        >
            Play
        </button>
        {#if innerWidth > MIN_WIDTH_MOBILE}
        <div class="inline-block h-[100%] w-2 min-w-2 rounded-sm self-stretch bg-blue-300 dark:bg-white/10"></div>
        {/if}
        <PrivateLobbyPopover onCreateLobby={() => handleFindGame(true)} onJoinLobby={(value) => handleJoinLobby(value)} />
    </div>

        {#if data.user}
            <Account user={data.user}/>
        {/if}
    
    {/if}

</div>


