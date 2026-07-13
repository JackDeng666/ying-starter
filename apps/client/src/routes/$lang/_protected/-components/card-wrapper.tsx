import type { PropsWithChildren } from 'react'
import { linkOptions, Link, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export const CardWrapper = ({ children }: PropsWithChildren) => {
  const params = useParams({ from: '/$lang' })
  const { t } = useTranslation('auth')

  const Links = linkOptions([
    {
      name: 'text.profile',
      to: '/$lang/profile',
      params
    },
    {
      name: 'text.reset_password',
      to: '/$lang/reset-password',
      params
    }
  ])

  return (
    <div className="w-full sm:w-135 border-none flex-1 sm:flex-none sm:min-h-130 rounded-none sm:rounded-md shadow-none sm:shadow-sm flex flex-col bg-white">
      <nav className="flex justify-between items-end p-4 pb-0 border-b">
        <div className="flex gap-x-4">
          {Links.map(el => (
            <Link
              key={el.to}
              className="text-center h-10 border-primary cursor-pointer border-b-0"
              activeProps={{ className: 'border-b-4' }}
              {...el}
            >
              {t(el.name)}
            </Link>
          ))}
        </div>
      </nav>
      {children}
    </div>
  )
}
