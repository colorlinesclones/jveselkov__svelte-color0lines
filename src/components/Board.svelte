<script>
  import Field from './Field.svelte'

  import { 
    createNewTable, 
    moveBallOnTable, 
    checkLines, 
    eraseTableCells,
    gameOver,
    addNextBalls,
    checkAvailableCell,
    getPoints
  } from '../helpers/table.js'

  let selected
  let table
  let score

  function dropSelected() {
    selected = {
      rowIndex: null,
      cellIndex: null
    }
  }
  
  function initGame() {
    dropSelected()
    table = createNewTable()
    score = 0
  }
  
  function cellClick(rowIndex, cellIndex) {
    if (selected.rowIndex === rowIndex && selected.cellIndex === cellIndex) {
      dropSelected()

      return
    }

    selected = {
      rowIndex,
      cellIndex
    } 
  }

  function emptyCellClick(rowIndex, cellIndex) {
    if (selected.rowIndex == undefined 
      && selected.cellIndex == undefined) {
      
      return
    }
    let moved = false 
    
    if (checkAvailableCell(table, selected.rowIndex, selected.cellIndex, rowIndex, cellIndex)) {
      table = moveBallOnTable(table, selected.rowIndex, selected.cellIndex, rowIndex, cellIndex)
      moved = true
    }
    
        
    setTimeout(() => {
      const lines = checkLines(table, rowIndex, cellIndex)

      if (lines.length !== 0) {
        score += getPoints(lines.length)

        table = eraseTableCells(table, lines)
      } else {
        if (gameOver(table)) {
          console.log('game over') 

          return
        }

        if (moved) {
          table = addNextBalls(table)
        }
      }

      dropSelected()      
    }, 500)    
  }

  initGame()
</script>

<p>Score: {score}</p>
<div class="board">
  {#each table as row, rowIndex}
    <div class="row">
      {#each row as cell, cellIndex}
        <Field 
          color={cell}
          selected={selected.rowIndex === rowIndex && selected.cellIndex === cellIndex}
          on:cell-click={()=> cellClick(rowIndex, cellIndex)}
          on:empty-cell-click={()=> emptyCellClick(rowIndex, cellIndex)}
        />
      {/each}
    </div>
  {/each}
</div>

<style>
  .board {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .row {
    display: inline-flex; 
  }
</style>