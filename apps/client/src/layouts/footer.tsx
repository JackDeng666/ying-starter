import { MaxWidthWrapper } from './max-width-wrapper'
import { Notification } from './notification'
import { SwitchLanguage } from './switch-language'

export const Footer = () => {
  return (
    <footer className="bg-white h-24 sm:h-20 relative border-t">
      <MaxWidthWrapper>
        <div className="h-full flex flex-col gap-3 sm:flex-row sm:justify-between justify-center items-center">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} All rights reserved</p>
            <Notification />
          </div>
          <SwitchLanguage />
        </div>
      </MaxWidthWrapper>
    </footer>
  )
}
