const s = 1000
const m = s * 60
const h = m * 60
const d = h * 24
const w = d * 7
const y = d * 365.25

export function ms(str: string, options?: { long?: boolean }): number
export function ms(num: number, options?: { long?: boolean }): string

/**
 * Parse or format the given `val`.
 */
export function ms(val: string | number, options?: { long?: boolean }) {
  options = options || {}

  if (typeof val === 'string' && val.length > 0) {
    return parse(val)
  } else if (typeof val === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val)
  }

  throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val))
}

/**
 * Parse the given `str` and return milliseconds.
 */
function parse(str: string) {
  str = String(str)
  if (str.length > 100) {
    return
  }
  const match =
    /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
      str
    )
  if (!match) {
    return
  }
  const n = parseFloat(match[1])
  const type = (match[2] || 'ms').toLowerCase()
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y
    case 'weeks':
    case 'week':
    case 'w':
      return n * w
    case 'days':
    case 'day':
    case 'd':
      return n * d
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n
    default:
      return undefined
  }
}

/**
 * Short format for `ms`.
 */

function fmtShort(ms: number) {
  const msAbs = Math.abs(ms)
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd'
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h'
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm'
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's'
  }
  return ms + 'ms'
}

/**
 * Long format for `ms`.
 */

function fmtLong(ms: number) {
  const msAbs = Math.abs(ms)
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day')
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour')
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute')
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second')
  }
  return ms + ' ms'
}

/**
 * Pluralization helper.
 */
function plural(ms: number, msAbs: number, n: number, name: string) {
  const isPlural = msAbs >= n * 1.5
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '')
}
