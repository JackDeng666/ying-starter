import { CSSProperties } from 'react'
import { cn } from '@ying/frontend/ui'

interface SvgIconProps {
  prefix?: string
  icon: string
  color?: string
  size?: string | number
  className?: string
  style?: CSSProperties
}

export default function SvgIcon({
  icon,
  prefix = 'ic',
  color = 'currentColor',
  size = '1em',
  className = '',
  style = {}
}: SvgIconProps) {
  const symbolId = `#${prefix ? `${prefix}-` : ''}${icon}`
  const svgStyle: CSSProperties = {
    width: size,
    height: size,
    color,
    ...style
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={cn('fill-current overflow-hidden outline-none', className)}
      style={svgStyle}
    >
      <use xlinkHref={symbolId} fill="currentColor" />
    </svg>
  )
}
