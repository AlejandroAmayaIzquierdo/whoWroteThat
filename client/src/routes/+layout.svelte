<script lang="ts">
    import MusicPlayer from "$lib/components/ui/Audio/MusicPlayer.svelte";
	import { onMount } from "svelte";
    import "../app.pcss";


    let player: any;
    let userInteracted = false; // Flag to track user interaction

    // Function to handle user interaction
    const handleUserInteraction = () => {
        if (!userInteracted) {
            player?.initializeAudio();
            userInteracted = true; // Set flag to true to indicate user interaction
        }
    };

    onMount(() => {
        // Listen for user interaction event
        window.addEventListener('click', handleUserInteraction, { once: true });
        window.addEventListener('keydown', handleUserInteraction, { once: true });
    });
</script>



<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="h-full w-full absolute top-0 left-0 mx-auto">
    <MusicPlayer bind:this={player} />
    <slot/>
</div>
