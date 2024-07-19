import React from 'react'

export interface LayoutProps {
  children?: React.ReactNode
}

export interface ClassNameProps {
  className?: string
}

export interface LayoutWithClassProps extends LayoutProps, ClassNameProps {}
