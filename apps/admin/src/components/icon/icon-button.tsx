import { ButtonProps } from 'antd'
import { CSSProperties, ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  style?: CSSProperties
} & ButtonProps
export default function IconButton({ children, className, style, onClick, disabled }: Props) {
  return (
    <button
      style={style}
      className={`flex cursor-pointer items-center justify-center rounded-full p-2 disabled:grayscale disabled:bg-hover hover:bg-hover ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
