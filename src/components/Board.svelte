<script>
  import Field from './Field.svelte'
  import {
    score,
    table,
    next }from './../store'
  import { 
    getRandomEmptyField, 
    getPath, 
    checkLines,
    getPoints,
    gameOver } from './../helpers'
  
  let selected
  let loose

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
    const path = getPath(
      $table, 
      selected.rowIndex, 
      selected.cellIndex, 
      rowIndex, 
      cellIndex
    )
    
    let moved = false

    if (path.length > 0) {    
      await moveBall(path)
      moved = true
    }

    const isErase = await check(rowIndex, cellIndex)
    
    if (gameOver($table)) {
      loose = true 

      return
    }

    if (moved && !isErase) {
      addNext()
    }
    dropSelected()
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
          score.add(getPoints(line.length))

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
    <h2>Score: { $score }</h2>

    {#each $next as ball}
      <Field color={ball}/>
    {/each}

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

  <div class="bottom">
    {#if loose}
      <h2> Game over</h2> 
    {/if}
  </div>

</div>

<style>
  .top,
  .bottom,
  .board {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .top {
    flex-direction: row;
  }
  .top h2,
  .top button {
    display: inline-flex;
    margin: 1em;
  }
 
 .board .row {
    display: inline-flex; 
  }
</style>