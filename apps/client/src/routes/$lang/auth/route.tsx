import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { hasAuth } from '@/store/auth-store'

export const Route = createFileRoute('/$lang/auth')({
  beforeLoad: ({ params }) => {
    if (hasAuth()) {
      throw redirect({
        to: '/$lang',
        params
      })
    }
  },
  component: RouteComponent
})

function RouteComponent() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <Outlet />
    </div>
  )
}
