<script lang="ts">
  import { fade } from 'svelte/transition'

  interface $$Props {
    color: number
    selected?: boolean
  }

  export let color = 0
  export let selected = false

  $: style =
    color !== 0
      ? `background: radial-gradient(circle at 0.5em 0.5em, var(--ball-color-${color}), #000);`
      : ''
</script>

{#if color !== 0}
  <div
    transition:fade={{ duration: 250 }}
    {style}
    class="ball"
    class:bounce={selected}
  />
{/if}

<style>
  .ball {
    position: absolute;
    top: 15%;
    left: 15%;
    border-radius: 50%;
    height: 70%;
    width: 70%;
    box-shadow: 0.2em 0.2em 0.4em var(--dark-color),
      -0.2em -0.2em 0.4em var(--light-color);
  }

  .ball.bounce {
    animation-name: ball-bounce;
    animation-iteration-count: infinite;
    animation-duration: 1s;
    animation-timing-function: cubic-bezier(0.5, 0.5, 0.5, 0.5);
  }

  @keyframes ball-bounce {
    0% {
      transform: translate3d(0px, 0px, 0) scale3d(0.9, 1.1, 1);
    }
    25% {
      transform: translate3d(0, 4px, 0) scale3d(1.1, 0.9, 1);
    }
    50% {
      transform: translate3d(0px, 0px, 0) scale3d(0.9, 1.1, 1);
    }
    75% {
      transform: translate3d(0px, -4px, 0) scale3d(1, 1, 1);
    }
    100% {
      transform: translate3d(0px, -4px, 0) scale3d(1, 1, 1);
    }
  }
</style>
