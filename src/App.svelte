<script>
	import Board from './components/Board.svelte'
</script>

<main>
  <Board />
</main>

<style>
  :root{
    --base-color: #d8e3e9;
    --light-color: #ffffff;
    --dark-color: #959da1;
    --button-light-color: #e7f3f9;
    --button-dark-color: #c2ccd2;
    --text-color: #2B303A;
    --alert-color: #D64933;

    --ball-color-1: #C2F9BB;
    --ball-color-2: #8D6A9F;
    --ball-color-3: #F9F8F8;
    --ball-color-4: #DDA448;
    --ball-color-5: #BB342F;
  }
  main {
    height: 100%;
    font-size: 1.2rem;
    color: var(--text-color);
  }
</style>