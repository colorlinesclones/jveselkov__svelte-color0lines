export function debounce<
  F extends (...args: Parameters<F>) => ReturnType<F>,
>(func: F, timeout: number = 300) {
  let timer: number

  return (...args: Parameters<F>) => {
    clearTimeout(timer)

    timer = window.setTimeout(() => {
      func(...args)
    }, timeout)
  }
}
