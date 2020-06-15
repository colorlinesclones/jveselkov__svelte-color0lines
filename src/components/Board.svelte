<script>
  import Field from './Field.svelte'

  import { 
    createNewTable, 
    moveBallOnTable, 
    checkLines, 
    eraseTableCells,
    gameOver,
    getPath,
    getPoints,
    getNewBalls,
    getRandomEmptyField,
    setTableCell
  } from '../helpers/table.js'

  let selected
  let table
  let score
  let nextBalls
  let loose

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
    nextBalls = [...getNewBalls()]
    loose = false
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

  async function emptyCellClick(rowIndex, cellIndex) {
    if (selected.rowIndex == undefined 
      && selected.cellIndex == undefined) {
      
      return
    }
    
    let moved = false 
    
    const path = getPath(table, selected.rowIndex, selected.cellIndex, rowIndex, cellIndex)

    if (path.length > 0) {    
      await moveBall(path)  
      
      moved = true
    }
    
    const isErase = await check(rowIndex, cellIndex)

    if (gameOver(table)) {
      loose = true 

      return
    }

    if (moved && !isErase) {
      nextBalls.forEach( async (ball) => {
        const newField = getRandomEmptyField(table)
        table = setTableCell(table, newField.rowIndex, newField.cellIndex, ball)
        
        await check(newField.rowIndex, newField.cellIndex)
        
      })
      nextBalls = getNewBalls()
    }
    
    dropSelected()
  }

  async function moveBall(path) {
    return new Promise(resolve => {
      for (let index = 1; index < path.length; index++) {
        setTimeout(() => {
          table = moveBallOnTable(
            table, 
            path[index-1].rowIndex, 
            path[index-1].cellIndex, 
            path[index].rowIndex, 
            path[index].cellIndex
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
        const lines = checkLines(table, rowIndex, cellIndex)

        if (lines.length !== 0) {
          score += getPoints(lines.length)

          table = eraseTableCells(table, lines)
          resolve(true)
        }

        resolve(false)
      }, 500)
    })
  }  

  initGame()

</script>

<div class="top">
  <h2>Score: {score}</h2>

  {#each nextBalls as ball}
    <Field color={ball}/>
  {/each}

  <button 
    on:click={() => initGame()}
  >restart</button>
</div>

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

<div class="bottom">
  {#if loose}
    <h2> Game over</h2> 
  {/if}
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