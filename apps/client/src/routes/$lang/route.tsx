import { createFileRoute, Outlet } from '@tanstack/react-router'
import { NotFound } from '@/layouts/not-found'

export const Route = createFileRoute('/$lang')({
  component: RouteComponent,
  notFoundComponent: NotFound
})

function RouteComponent() {
  return <Outlet />
}
