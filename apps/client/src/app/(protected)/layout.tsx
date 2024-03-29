import { Suspense } from 'react'
import { CardWrapper } from './_components/card-wrapper'

interface ProtectedLayoutProps {
  children: React.ReactNode
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      <Suspense>
        <CardWrapper>{children}</CardWrapper>
      </Suspense>
    </div>
  )
}

export default ProtectedLayout
