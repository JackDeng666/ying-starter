export function createTreeFns(array = [], idField = 'id', parentIdFiled = 'parentId') {
  function toTree(parentId: any) {
    return array.filter(el => el[parentIdFiled] === parentId).map(el => ({ ...el, children: toTree(el[idField]) }))
  }

  return {
    toTree
  }
}

export function flattenTrees<T extends { children?: T[] }>(trees: T[] = []): T[] {
  return trees.reduce<T[]>((prev, cur) => {
    if (cur.children) {
      return prev.concat(cur, ...flattenTrees(cur.children))
    } else {
      return prev.concat(cur)
    }
  }, [])
}

export function debounce<T>(callback: (params?: T) => void, delay = 200): (params?: T) => void {
  let timer = 0
  return function (params?: T) {
    if (timer) clearTimeout(timer)
    timer = window.setTimeout(() => {
      callback(params)
    }, delay)
  }
}

export function getOption<T extends { label: string; value: number }>(arr: T[], value: number): T {
  return arr.find(el => el.value === value)
}

export function unique(arr: any[]) {
  const obj = {}
  arr.forEach(el => (obj[JSON.stringify(el)] = 1))
  return Object.keys(obj).map(el => JSON.parse(el))
}
