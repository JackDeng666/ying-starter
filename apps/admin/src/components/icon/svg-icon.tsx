import { CSSProperties } from 'react'

type SVGComponent = React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & {
    title?: string
    titleId?: string
    desc?: string
    descId?: string
  }
>
const SvgIcons: Record<string, SVGComponent> = {}
const initSVGIcons = () => {
  const modules = import.meta.glob('../../assets/icons/**/*.svg', { eager: true, query: '?react' })
  Object.keys(modules).forEach(moduleKey => {
    const SVGCom = (modules[moduleKey] as any).default as SVGComponent
    const key = moduleKey.split('icons/').at(-1).split('.').at(0).split('/').join('-')
    SvgIcons[key] = SVGCom
  })
}
initSVGIcons()

type SvgIconProps = {
  icon: string
  color?: string
  size?: string | number
  className?: string
  style?: CSSProperties
}

export function SvgIcon({ icon, color = 'currentColor', size = '1em', className = '', style = {} }: SvgIconProps) {
  const svgStyle: CSSProperties = {
    width: size,
    height: size,
    color,
    ...style
  }
  const SVG = SvgIcons[icon]
  return <SVG className={className} style={svgStyle} />
}
