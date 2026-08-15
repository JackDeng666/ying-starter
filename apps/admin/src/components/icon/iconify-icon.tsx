import { Icon } from '@iconify/react'
import type { IconProps } from '@iconify/react'

type IconifyProps = IconProps & {
  size?: IconProps['width']
}
export function Iconify({ icon, size = '1em', className = '', ...other }: IconifyProps) {
  return <Icon icon={icon} width={size} height={size} className={className} {...other} />
}
