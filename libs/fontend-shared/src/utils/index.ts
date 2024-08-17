export * as storage from './storage'

export function copyText(str: string) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(str)
  } else {
    return new Promise((reslove, reject) => {
      try {
        const textarea = document.createElement('textarea')
        document.body.appendChild(textarea)
        textarea.style.position = 'fixed'
        textarea.style.clip = 'rect(0 0 0 0)'
        textarea.style.top = '10px'
        textarea.value = str
        textarea.select()
        document.execCommand('copy', true)
        document.body.removeChild(textarea)
        reslove(str)
      } catch (error) {
        reject(error)
      }
    })
  }
}

export function doDownload(url: string, fileName: string) {
  const a = document.createElement('a')
  a.download = fileName
  a.href = url
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
