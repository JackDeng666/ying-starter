import type { PropsWithChildren } from 'react'

export interface PropsWithClassName {
  className?: string
}

export interface LayoutProps extends PropsWithChildren, PropsWithClassName {}
