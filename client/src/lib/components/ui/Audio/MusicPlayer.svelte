<script lang="ts">
    import Music from '@iconify/icons-bi/music-note';
    import Pause from '@iconify/icons-bi/pause-fill';
    import Icon from "@iconify/svelte";
    import Slider from '../Slider/Slider.svelte';

    let showSlider: boolean = false;

    let audio: HTMLAudioElement; // Declare audio element without initialization
    let isPlaying = false;

    let volume: number = 20;

    // Function to initialize the audio element
    const initializeAudio = () => {
        if (!audio) {
            audio = new Audio('/Options-Mario-Kart-Wii.mp3');
            audio.loop = true;
            audio.volume = 0.2;
        }
    };

    // Function to handle play/pause
    const playPauseAudio = () => {
        initializeAudio(); // Ensure audio is initialized before playing or pausing
		if (audio.paused) {
			audio.play();
			isPlaying = true;
		} else {
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

    // Automatically play audio when isPlaying changes
    $: {
        if (isPlaying) {
            initializeAudio(); // Ensure audio is initialized before playing
            if (audio) {
                audio.play();
            }
        } else {
            if (audio) {
                audio.pause();
            }
        }
    }

    
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
