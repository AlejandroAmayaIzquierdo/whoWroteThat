
<script lang="ts">
	import { goto } from "$app/navigation";
	import type { PageData } from "./$types";
    import Account from '$lib/components/Game/Account.svelte';


    export let data: PageData;

    // if(data.user === null)
    //     goto('/game');
</script>

<button on:click={() => goto('/game')}>
    <span>Play</span>
</button>

<button on:click={() => goto('/history')}>
    <span>History</span>
</button>

{#if data.user}
<Account user={data.user}/>
{/if}