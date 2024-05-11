import React from 'react'

export interface LayoutProps {
  children: React.ReactNode
}

export interface LayoutWithClassProps extends LayoutProps {
  className?: string
}
