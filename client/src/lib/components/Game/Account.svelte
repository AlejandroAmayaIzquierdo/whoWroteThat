

<script lang="ts">
    import Icon from '@iconify/svelte';
    import profileFill from '@iconify/icons-iconamoon/profile-fill';
	import { Cookies } from '$lib/util/Cookies';
	import { User } from '../../../services/user';
	import { goto } from '$app/navigation';

    export let user: App.User;


    const handleLogOut = async () => {
        try {
            await User.logout(Cookies.getCookie('auth') ?? '');
            Cookies.eraseCookie('auth');
        } catch (error) {
            Cookies.eraseCookie('auth');
        }
        goto('/game', { replaceState: true });

    }
</script>


<div class="absolute right-2 top-2 flex items-center rounded-xl backdrop-blur-xl shadow-xl bg-white gap-4 px-2 sm:px-4 py-1 sm:py-2 sm:text-2xl">
    {#if user.profilePic}
        <img src={user.profilePic} alt="profile" class="w-8 h-8 sm:w-12 sm:h-12 select-none rounded-full"/>
    {:else}
        <Icon icon={profileFill} class="w-8 h-8 sm:w-12 sm:h-12 select-none rounded-full"/>
    {/if}
    <div class="flex flex-col items-start font-bold">
        <p class="max-w-[200px] overflow-hidden overflow-ellipsis whitespace-nowrap">
            {user.profileName ?? user.userName ?? user.userId}
        </p> 
        <div class="flex items-center gap-2">
            <button on:click|preventDefault={handleLogOut}
            class="ml-1 origin-center text-right text-sm text-red-800 font-bold transition-transform hover:scale-105 active:scale-95">
                Log out
            </button>
        </div> 
    </div> 
</div>