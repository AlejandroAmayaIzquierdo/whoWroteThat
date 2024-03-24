<script lang="ts">
    import { createSlider, melt } from '@melt-ui/svelte';

    export let value = 30;

    export let onChange: (value: number) => void;
  
    const {
      elements: { root, range, thumbs },
    } = createSlider({
      defaultValue: [value],
      min: 0,
      max: 100,
      step: 1,
    });
    $: {
        onChange($thumbs[0]['aria-valuenow']);
    }
  </script>
  
  <span use:melt={$root} class="relative flex h-[20px] w-[200px] items-center">
    <span class="h-[3px] w-full bg-black/40">
      <span use:melt={$range} class="h-[3px] bg-blue-400" />
    </span>
  
    <span
      use:melt={$thumbs[0]}
      class="h-5 w-5 rounded-full bg-gray-500 focus:ring-4 focus:!ring-black/40"
    />
  </span>