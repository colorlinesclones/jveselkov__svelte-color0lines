<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { ComponentProps } from 'svelte'

  import Ball from './Ball.svelte'

  interface $$Props extends ComponentProps<Ball> {}

  export let color = 0
  export let selected = false

  interface $$Events {
    emptyCellClick: CustomEvent<null>
    cellClick: CustomEvent<null>
  }

  const dispatch = createEventDispatcher()

  function clickBall() {
    dispatch(color === 0 ? 'emptyCellClick' : 'cellClick')
  }
</script>

<div class="field" on:pointerdown={clickBall}>
  <Ball {color} {selected} />
</div>

<style>
  .field {
    position: relative;
    margin: 0.2em;
    height: var(--field-width);
    width: var(--field-width);
    border-radius: 10%;
    background: var(--base-color);
    box-shadow: 0.2em 0.2em 0.4em var(--dark-color),
      -0.2em -0.2em 0.4em var(--light-color);
  }
</style>
