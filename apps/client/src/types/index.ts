import React from 'react'

export interface BasicParams {
  lng: string
}

export interface LayoutProps {
  children?: React.ReactNode
  params?: BasicParams
}

export interface ClassNameProps {
  className?: string
}

export interface LayoutWithClassProps extends LayoutProps, ClassNameProps {}
