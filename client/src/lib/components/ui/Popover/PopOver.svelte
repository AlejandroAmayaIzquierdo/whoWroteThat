<script lang="ts">
    import { createPopover, melt } from '@melt-ui/svelte';

    export let placement: 'top' | 'right' | 'bottom' | 'left' = 'top';

    export let offSet: number = 10;

    import { fade } from 'svelte/transition';
  
    const {
      elements: { trigger, content, arrow, close },
      states: { open },
    } = createPopover({
      forceVisible: true,
      positioning: {
        placement,
        gutter: offSet
      },
    });

    export let buttonText: string = "Open Popover";
    export let classButton: string = "";
    export let classContent: string = "";
</script>

<button
  type="button"
  class={`${classButton}`}
  use:melt={$trigger}
  aria-label="Update dimensions"
>
    {buttonText}
    <span class="sr-only">Open Popover</span>
</button>

{#if $open}
  <div
    use:melt={$content}
    transition:fade={{ duration: 100 }}
    class={`content ${classContent}`}
  >
    <div use:melt={$arrow} />
    <slot />
    <button class="close" use:melt={$close}>
        <svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg
					>
    </button>
  </div>
{/if}

<style lang="postcss">
    fieldset {
      @apply flex items-center gap-5;
    }
  
    label {
      @apply w-[75px] text-sm text-neutral-700;
    }
  
    p {
      @apply mb-2 font-medium text-neutral-900;
    }
  
    .input {
      @apply flex h-8 w-full rounded-md border border-magnum-800 bg-transparent px-2.5 text-sm;
      @apply ring-offset-magnum-300 focus-visible:ring;
      @apply focus-visible:ring-magnum-400 focus-visible:ring-offset-1;
      @apply flex-1 items-center justify-center;
      @apply px-2.5 text-sm leading-none text-magnum-700;
    }
  
    .trigger {
      @apply inline-flex h-9 w-9 items-center justify-center rounded-full bg-white p-0;
      @apply text-sm font-medium text-magnum-900 transition-colors hover:bg-white/90;
      @apply focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
    }
  
    .close {
      @apply absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-sm;
      @apply text-magnum-900 transition-colors hover:bg-magnum-500/10;
      @apply focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
      @apply  text-sm font-medium;
    }
  
    .content {
      @apply z-10;
    }
  </style>