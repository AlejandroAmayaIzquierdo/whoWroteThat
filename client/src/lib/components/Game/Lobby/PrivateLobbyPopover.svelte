<script lang="ts">
	import PopOver from "$lib/components/ui/Popover/PopOver.svelte";

    let lobbyID: string = '';
	$: isJoinDisabled = lobbyID.length === 0 ? false : true;

    export let onCreateLobby: () => void = () => {};
    export let onJoinLobby: (lobbyID: string) => void = () => {};
</script>

<PopOver 
    buttonText="Play Private"
    classButton="inline-flex items-center justify-center rounded-xl bg-white px-4 py-3
    font-medium leading-none text-blue-400 shadow-md hover:opacity-75 w-1/3 active:scale-90 transition-all active:brightness-[0.99]"
    classContent="w-100 rounded-[4px] backdrop-blur-xl backdrop-opacity-85 p-5 shadow-lg h-[300px]"
    offSet={50}
>
    <div class="flex h-full w-full flex-col content-center justify-evenly">
        <div>
            <p>Create Private Lobby</p>
            <div class="my-2 flex w-full items-center gap-2">
                <button
                    class="relative min-w-[73px] flex-1 cursor-pointer select-none rounded-md bg-blue-400  shadow-lg outline-none transition-all hover:brightness-[1.1] active:scale-90 active:brightness-[0.9]"
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
                    bind:value={lobbyID}
                />
                
                <button
                    class="relative min-w-[73px] flex-1 cursor-pointer select-none rounded-md bg-blue-500 shadow-lg outline-none transition-all hover:brightness-[1.1] active:scale-90 active:brightness-[0.9] {!isJoinDisabled
                        ? 'cursor-not-allowed opacity-50'
                        : ''}"
                    style="height: 49px;"
                    disabled={!isJoinDisabled}
                    on:click={() => {
                        onJoinLobby(lobbyID);
                    }}
                >
                    <span class="text-white">Join</span>
                </button>
            </div>
        </div>
    </div>
</PopOver>