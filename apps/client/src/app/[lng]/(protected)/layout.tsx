import { CardWrapper } from './_components/card-wrapper'

interface ProtectedLayoutProps {
  children: React.ReactNode
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <CardWrapper>{children}</CardWrapper>
    </div>
  )
}

export default ProtectedLayout
