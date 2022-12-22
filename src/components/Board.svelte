<script lang="ts" strictEvents>
  import Field from './Field.svelte'

  import {
    score,
    table,
    next,
    selected,
    emptyBallsCount,
  } from '@/store'

  import {
    getRandomEmptyField,
    getPath,
    checkLines,
    debounce,
  } from '@/helpers'

  let loose = false
  let blocked = false

  $: loose = $emptyBallsCount - $next.length <= 0

  function cellClick(field: TField) {
    return () => selected.set(field)
  }

  function emptyCellClick(field: TField) {
    return () => {
      if (loose || $selected === null) {
        return
      }

      const path = getPath($table, $selected, field)

      selected.reset()

      if (path.length === 0) {
        return
      }

      blocked = true

      moveBall(path)
        .then(() => check(field))
        .catch(() => addNext())
        .finally(() => {
          blocked = false
        })
    }
  }

  async function moveBall(path: TPath) {
    return new Promise<null>((resolve) => {
      for (let index = 1; index < path.length; index++) {
        setTimeout(() => {
          table.moveBall(path[index - 1], path[index])

          if (index === path.length - 1) {
            resolve(null)
          }
        }, 100 * index)
      }
    })
  }

  async function check(field: TField) {
    return new Promise<null>((resolve, reject) => {
      setTimeout(() => {
        const line = checkLines($table, field)

        if (line.length !== 0) {
          score.add(line.length)

          table.eraseLine(line)
          resolve(null)
        }

        reject()
      }, 500)
    })
  }

  function addNext() {
    $next.forEach(async (element) => {
      const newField = getRandomEmptyField($table)

      table.setBall(newField, element)

      await check(newField).catch(() => {})
    })

    next.random()
  }

  function init() {
    score.reset()
    selected.reset()
    table.reset()
    next.reset()

    loose = false

    addNext()
  }

  init()
</script>

<div class="board" class:blocked>
  <div class="top">
    <p>Score: {$score}</p>
    {#if loose}
      <p>Game over</p>
    {:else}
      <div class="next">
        {#each $next as ball}
          <Field color={ball} />
        {/each}
      </div>
    {/if}
    <button on:click={debounce(init)}>restart</button>
  </div>

  {#each $table as row, rowIndex}
    <div class="row">
      {#each row as cell, cellIndex}
        <Field
          selected={$selected?.rowIndex === rowIndex &&
            $selected?.cellIndex === cellIndex}
          on:cellClick={cellClick({ rowIndex, cellIndex })}
          on:emptyCellClick={emptyCellClick({
            rowIndex,
            cellIndex,
          })}
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
  .board.blocked {
    pointer-events: none;
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
