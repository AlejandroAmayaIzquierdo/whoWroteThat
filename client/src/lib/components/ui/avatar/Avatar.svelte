<script lang="ts">
    import { CurrentUser } from "$lib/stores/user";

    export let width: number = 10;
    export let height: number = 10;

    export let user: App.User | null = $CurrentUser;

    const handleGetUserInitials = (userName: string) => {
        const [firstName, lastName] = userName.split(" ");
        if(lastName === undefined || lastName === null || lastName === "")
            return firstName.charAt(0).toUpperCase();
        return firstName.charAt(0) + lastName.charAt(0);
    };
</script>

<div class="relative inline-flex items-center justify-center overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 shadow-lg" style="width: {width}px; height: {height}px;">
    {#if user?.userName}
        <span class="font-medium text-gray-600 dark:text-gray-300">{handleGetUserInitials(user?.userName)}</span>
    {:else}
        <svg class="absolute w-full h-full text-gray-400 -left-1 border-solid border-gray-50" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
    {/if}
</div>
