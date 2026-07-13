export function replaceState() {
  let url = window.location.href
  if (url.indexOf('?') !== -1) {
    url = url.replace(/(\?|#)[^'"]*/, '')
    window.history.replaceState({}, '', url)
  }
}

export function strMatchArr(path: string, arr: string[], macthFunc: 'startsWith' | 'endsWith') {
  for (const el of arr) {
    if (path[macthFunc](el)) {
      return el
    }
  }
}
