import { cn } from '@ying/frontend/ui'
import { useSettings } from '@/store'
import { useThemeToken } from '@/theme/hooks'

type MainProps = {
  children: React.ReactNode
}
export function Main({ children }: MainProps) {
  const { themeStretch } = useSettings()
  const { padding } = useThemeToken()

  return (
    <div
      className={cn('m-auto max-w-full h-full flex-auto grow', themeStretch && 'xl:max-w-screen-xl')}
      style={{
        transition: 'max-width 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
      }}
    >
      <div style={{ padding }}>{children}</div>
    </div>
  )
}
