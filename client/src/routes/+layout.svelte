<script>
    import MusicPlayer from "$lib/components/ui/Audio/MusicPlayer.svelte";
    import "../app.pcss";
</script>



<div class="h-full w-full absolute top-0 left-0 mx-auto">
    <MusicPlayer />
    <slot/>
</div>
