import type { Workspace } from '@/api'
import { api } from '@/api'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { CogIcon, UserCircle } from 'lucide-react'

export const Route = createFileRoute('/_app')({
  loader: () => api<Workspace[]>('/workspaces'),
  component: AppLayout,
})

function AppLayout() {
  const workspaces = Route.useLoaderData()
  return (
    <div className="flex min-h-dvh">
      <div className="sticky top-0 h-dvh w-56 shrink-0 flex flex-col bg-gray-50 border-r border-gray-300 p-3 justify-between">
        <nav
          aria-label="Workspaces navigation"
          className='flex flex-col'
        >
          <Link to="/" className="size-10 p-2 rounded-lg bg-black text-slate-50 text-center flex justify-center items-center mb-5">
              <span className="text-lg font-bold">do.</span>
          </Link>
        <span className="px-3 text-sm font-bold mb-4">Workspaces</span>
          {
            workspaces.length > 0 &&
              workspaces.map((workspace) => (
                <Link
                  to="/workspaces/$workspaceId"
                  params={{ workspaceId: workspace.id }}
                  key={workspace.id}
                  className="px-3 py-2 rounded-md gap-2 flex items-center"
                  activeProps={{ className: 'bg-gray-200 font-semibold' }}
                >
                  {workspace.name}
                </Link>
            ))
          }
          <Link
            to="/workspaces/create"
            className="px-4 py-2 rounded-md gap-2 flex items-center text-gray-500"
            activeProps={{ className: 'bg-gray-200 font-semibold' }}
          >
            + Add Workspace
          </Link>
        </nav>
        <nav
          aria-label="Secondary navigation"
          className='flex flex-col'
        >
          <Link
            to="/persons"
            className="px-3 py-2 rounded-md gap-2 flex items-center"
            activeProps={{ className: 'bg-gray-200 font-semibold' }}
          >
            <UserCircle size={16} className="inline-block" />
            People
          </Link>
          <Link
            to="/settings"
            className="px-3 py-2 rounded-md gap-2 flex items-center"
            activeProps={{ className: 'bg-gray-200 font-semibold' }}
          >
            <CogIcon size={16} className="inline-block" />
            Settings
          </Link>
        </nav>
      </div>
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  )
}
