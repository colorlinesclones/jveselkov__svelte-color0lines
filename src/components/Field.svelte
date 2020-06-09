<script>
  export let color
  export let selected

  import { createEventDispatcher } from 'svelte'
	import { fade } from 'svelte/transition'


	const dispatch = createEventDispatcher()

  $: style = color !== undefined  
              ? `background: radial-gradient(circle at 0.5em 0.5em, var(--ball-color-${color}), #000);`
              : ''

  $: classes = color !== undefined 
              ? `ball filled${selected ? ' bounce' : ''}` 
              : 'ball'

  function clickBall () {
    if (!color) {
      dispatch('empty-cell-click')
      
      return
    }

    dispatch('cell-click')
  }
</script>

<div 
  class="field"
  on:click={clickBall}
> 
  {#if color}
    <div 
      in:fade="{{duration: 250 }}"
      out:fade
      {style}
      class={classes}
    ></div>
  {/if}
</div>

<style>
  .field {
    position: relative;
    margin: 0.2em;
    height: 2em;
    width: 2em;
    border-radius: 10%;
    background: var(--base-color);
    box-shadow:  0.2em 0.2em 0.4em var(--dark-color), 
                -0.2em -0.2em 0.4em var(--light-color);
  }

  .ball{
    position: absolute;
    top: 15%;
    left: 15%;
    border-radius: 50%;
    height: 70%;
    width: 70%;
  }

  .ball.filled{    
    box-shadow:  0.2em 0.2em 0.4em var(--dark-color), 
                -0.2em -0.2em 0.4em var(--light-color);
  }

  .ball.bounce {
    animation-name: ball-bounce;
    animation-iteration-count: infinite;
    animation-duration: 1s;
    animation-timing-function: cubic-bezier(0.5, 0.5, 0.5, 0.5);
  }
  
  @keyframes ball-bounce {    
    0%   { transform: translate3d(0px, 0px, 0) scale3d(0.9, 1.1, 1);}
    25%  { transform: translate3d(0, 4px, 0) scale3d(1.1, 0.9, 1);}
    50%  { transform: translate3d(0px, 0px, 0) scale3d(0.9, 1.1, 1);}
    75%  { transform: translate3d(0px, -4px, 0) scale3d(1, 1, 1);}
    100% { transform: translate3d(0px, -4px, 0) scale3d(1, 1, 1);}
  }
</style>