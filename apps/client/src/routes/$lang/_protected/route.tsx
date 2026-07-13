import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { hasAuth } from '@/store/auth-store'

import { CardWrapper } from './-components/card-wrapper'

export const Route = createFileRoute('/$lang/_protected')({
  beforeLoad: ({ params }) => {
    if (!hasAuth()) {
      throw redirect({
        to: '/$lang/auth/login',
        params
      })
    }
  },
  component: RouteComponent
})

function RouteComponent() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <CardWrapper>
        <Outlet />
      </CardWrapper>
    </div>
  )
}
