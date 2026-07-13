import { TipError } from '@/components/tip-error'
import { MaxWidthWrapper } from './max-width-wrapper'

export const NotFound = () => {
  return (
    <MaxWidthWrapper className="my-auto fc">
      <TipError message="Not Found." />
    </MaxWidthWrapper>
  )
}
