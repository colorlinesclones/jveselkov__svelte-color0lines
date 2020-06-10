<script>
  import Field from './Field.svelte'

  import { 
    createNewTable, 
    moveBallOnTable, 
    checkLines, 
    eraseTableCells,
    gameOver,
    addBall,
    getPath,
    getPoints,
    getNewBalls
  } from '../helpers/table.js'

  let selected
  let table
  let score
  let nextBalls

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
      console.log('game over') 

      return
    }

    if (moved && !isErase) {
      nextBalls.forEach( ball => {
        table = addBall(table, ball)
      })
      // await check()
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

<div class="top-panel">
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

<style>
  .board {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .top-panel {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .top-panel h2,
  .top-panel button {
    display: inline-flex;
    margin: 1em;
  }
  h2 {
    color: var(--text-color);
    text-shadow: 0.2em 0.2em 0.4em var(--dark-color), 
                -0.2em -0.2em 0.4em var(--light-color);
  }
  button {
    border: none;
    color: var(--text-color);
    text-shadow: 0.2em 0.2em 0.4em var(--dark-color), 
                -0.2em -0.2em 0.4em var(--light-color);
    border-radius: 3px;
    background: linear-gradient(145deg, var(--button-light-color), var(--button-dark-color));
    box-shadow:  0.2em 0.2em 0.4em var(--dark-color), 
                -0.2em -0.2em 0.4em var(--light-color);
  }

  button:active{
    background: linear-gradient(145deg, var(--button-dark-color), var(--button-light-color));
  }

  .row {
    display: inline-flex; 
  }
</style>