export function createTreeFns(array: any[] = [], idField = 'id', parentIdFiled = 'parentId'): any {
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

export function getOption<T extends { label: string; value: number }>(arr: T[], value: number): T | undefined {
  return arr.find(el => el.value === value)
}

export function unique(arr: any[]) {
  const obj: { [key in string]: number } = {}
  arr.forEach(el => (obj[JSON.stringify(el)] = 1))
  return Object.keys(obj).map(el => JSON.parse(el))
}

export function deepCopyArray<T>(arr: T[]): T[] {
  return arr.map(item => deepCopy(item))
}

export function deepCopy<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    const arrCopy: T[] = []
    for (const item of obj) {
      arrCopy.push(deepCopy(item))
    }
    return arrCopy as unknown as T
  }

  const objCopy: { [key: string]: any } = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      objCopy[key] = deepCopy(obj[key])
    }
  }

  return objCopy as T
}

// 让传入异步函数最少经过固定的秒数才返回内容
export function delyFunc<T extends (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>>>(func: T, dely: number) {
  return async (...args: Parameters<typeof func>): Promise<Awaited<ReturnType<typeof func>>> => {
    const time = Date.now()
    const res = await func(...args)
    const afterTime = Date.now() - time
    const finalDely = dely - afterTime
    if (finalDely > 0) {
      await new Promise(re => setTimeout(re, finalDely))
    }
    return res
  }
}
