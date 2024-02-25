<script lang="ts">
    import { tweened } from 'svelte/motion';

    export let isOpen = false;

    export let setIsOpen: (val: boolean) => void;
    export let onCreateLobby: () => void;
    export let onJoinLobby: (lobbyID: string) => void;


    let lobbyID: string = '';

    $: isJoinDisabled = lobbyID.length === 0 ? false : true;

    const isOpenValue = isOpen ? 1 : 0; // Use numbers instead of boolean

    const isOpenTweened = tweened(isOpenValue, { duration: 500 }); // Adjust duration as needed



    $: {
        isOpenTweened.set(isOpen ? 1 : 0); // Update isOpenTweened value based on isOpen
    }
</script>

{#if $isOpenTweened > 0}
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={() => setIsOpen(false)} 
    class="w-full h-full flex justify-center items-center absolute z-10">
    <div
    on:click|stopPropagation
    class="h-1/3 w-1/3 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 border-gray-800 bg-gray-100 p-4 text-center backdrop-blur-lg {isOpen ? 'animate-fade-in-up' : 'animate-fade-out-down'} animate-duration-normal"
>
    <div on:click|stopPropagation>
        <button
        class="absolute right-2 top-2 p-1 text-xl text-bl transition-transform hover:scale-110 active:scale-95"
        on:click={() => setIsOpen(false)}
        ><svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg
        ></button
    >
    <div class="flex flex-col justify-evenly content-center h-full w-full">
        <div>
            <p>Create Private Lobby</p>
            <div class="my-2 flex w-full items-center gap-2">
                <button
                    class="bg-blue-500 rounded-md shadow-lg relative min-w-[73px] flex-1 cursor-pointer select-none outline-none transition-all hover:brightness-[1.1] active:scale-90 active:brightness-[0.9]"
                    style="height: 49px;"
                    on:click={() => onCreateLobby()}
                    >
                    <span class="text-white">Create Lobby</span>
                </button>
            </div>
        </div>
        <div>
            <p>Join Lobby</p>
            <div class="my-2 flex w-full items-center gap-2">
                <input
                    class="w-full flex-1 self-stretch rounded-lg border-2 border-black bg-white/50 px-4 outline-none ring-black transition-shadow placeholder:text-neutral-500 focus:ring-2"
                    type="text"
                    placeholder="Code here"
                    maxlength="10"
                    bind:value={lobbyID}
                />
                <button
                    class="bg-blue-500 {!isJoinDisabled ? 'opacity-50' : ''} rounded-lg shadow-lg pointer-events-none relative min-w-[73px] cursor-pointer select-none outline-none transition-all hover:brightness-[1.1] active:scale-90 active:brightness-[0.9]"
                    style="height: 49px;"
                    disabled={isJoinDisabled}
                    on:click={() => {if(!isJoinDisabled) onJoinLobby(lobbyID)}}
                    >
                    <span class="text-white">Join</span>
                </button>
            </div>
        </div>
    </div>
    </div>
    
</div>
</div>

{/if}
