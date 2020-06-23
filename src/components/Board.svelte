<script>
  import Field from './Field.svelte'
  import {
    score,
    table,
    next,
    emptyBallsCount }from './../store'
  import { 
    getRandomEmptyField, 
    getPath, 
    checkLines } from './../helpers'
  import { fade } from 'svelte/transition'

  let selected
  
  let loose = false 
  $: loose = $emptyBallsCount - $next.length <= 0

  function dropSelected() {
    selected = {
      rowIndex: null,
      cellIndex: null
    }
  }

  function  cellClick(rowIndex, cellIndex) {
    if (selected.rowIndex === rowIndex && 
        selected.cellIndex === cellIndex) {
      dropSelected()
      return
      
    }

    selected = {
      rowIndex,
      cellIndex
    }
  }

  async function emptyCellClick(rowIndex, cellIndex) {
    if (loose || 
        (selected.rowIndex == null || 
        selected.cellIndex == null )) {

        return 
    }

    const path = getPath(
      $table, 
      selected.rowIndex, 
      selected.cellIndex, 
      rowIndex, 
      cellIndex
    )

    dropSelected()
    
    let moved = false

    if (path.length > 0) {    
      await moveBall(path)
      moved = true
    }

    const isErase = await check(rowIndex, cellIndex)

    if (moved && !isErase) {
      addNext()
    }
  }
  async function moveBall(path) {
    return new Promise(resolve => {
      for (let index = 1; index < path.length; index++) {
        setTimeout(() => {
          table.moveBall(
            path[index-1], 
            path[index]
          )

          if (index === path.length - 1) {
            resolve()
          }
        }, 100 * index)
      }        
    })
  }

  async function check(rowIndex, cellIndex) {
    return new Promise(resolve => {
      setTimeout( () => {
        const line = checkLines($table, rowIndex, cellIndex)

        if (line.length !== 0) {
          score.add(line.length)

          table.eraseLine(line)
          resolve(true)
        }

        resolve(false)
      }, 500)
    })
  }  

  function addNext() {
    $next.forEach(async (element) => {
      let newField = getRandomEmptyField($table)
      table.setBall(newField.rowIndex, newField.cellIndex , element)
      await check(newField.rowIndex, newField.cellIndex)
    })

    next.random()
  }

  function init() {
    dropSelected()
    table.reset()
    next.reset()
    score.reset()
    loose = false

    addNext()
  }

  init()
</script>

<div class="board">
  <div class="top">
  <p>Score: { $score }</p>
    {#if loose}
      <p> Game over</p> 
    {:else}
      <div class="next"> 
        {#each $next as ball}
          <Field color={ball}/>
        {/each}
      </div>
    {/if}
    <button
      on:click={() => init()}
    >restart</button>
  </div>

  {#each $table as row, rowIndex}
    <div class="row">
      {#each row as cell, cellIndex}
        <Field 
          selected={selected.rowIndex === rowIndex && selected.cellIndex === cellIndex}
          on:cell-click={()=> cellClick(rowIndex, cellIndex)}
          on:empty-cell-click={()=> emptyCellClick(rowIndex, cellIndex)}
          color={cell}
        />
      {/each}
    </div>
  {/each}

</div>

<style>
  .top,
  .board {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .top {
    flex-direction: row;
  }
  p,
  button,
  .next {
    display: inline-flex;
    margin: 1em;
  }
 
 .board .row {
    display: inline-flex; 
  }
</style>