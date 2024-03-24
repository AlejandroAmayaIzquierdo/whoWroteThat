<script lang="ts">
    import Music from '@iconify/icons-bi/music-note';
    import Pause from '@iconify/icons-bi/pause-fill';
    import Icon from "@iconify/svelte";
    import Slider from '../Slider/Slider.svelte';
	import { onMount } from 'svelte';

    let showSlider: boolean = false;

    let audio: HTMLAudioElement | null = null; // Initialize audio as null
    let isPlaying = false;

    let volume: number = 20;

    // Function to initialize the audio element
    export const initializeAudio = () => {
        if (!audio) {
            audio = new Audio('/Options-Mario-Kart-Wii.mp3');
            audio.loop = true;
            audio.volume = volume / 100;
            audio.play();
            isPlaying = true;
        }
    };

    // Function to handle play/pause
    const playPauseAudio = () => {
        if (!audio) {
            initializeAudio();
        }

        if (audio && audio.paused) {
            audio.play();
            isPlaying = true;
        } else if (audio) {
            audio.pause();
            isPlaying = false;
        }	 	
	}

    const updateVolume = (newVolume: number) => {
        volume = newVolume;
        if (audio) {
            audio.volume = volume / 100; // Update audio volume
        }
    };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div 
    on:mouseenter={() => {showSlider = true}} 
    on:mouseleave={() => {showSlider = false}}
    class="z-10 absolute left-2 top-2 flex items-center rounded-xl 
    backdrop-blur-xl shadow-xl bg-white gap-4 px-2 sm:px-4 py-1 sm:py-2 sm:text-2xl min-w-fit"
    style="transition: transform 0.3s ease;"
    >
    <button on:click={playPauseAudio}>
        <Icon icon={isPlaying ? Music : Pause} />
    </button>

    {#if showSlider }
        <Slider value={volume} onChange={updateVolume} />
    {/if}
</div>
