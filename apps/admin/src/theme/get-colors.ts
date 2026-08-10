export const getColors = () => {
  const CSS = getComputedStyle(document.documentElement)
  const success = CSS.getPropertyValue('--success')
  const warning = CSS.getPropertyValue('--warning')
  const error = CSS.getPropertyValue('--error')
  const info = CSS.getPropertyValue('--info')

  return {
    success,
    warning,
    error,
    info
  }
}
