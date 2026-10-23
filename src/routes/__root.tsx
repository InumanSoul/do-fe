import { Link, Outlet, createRootRoute } from '@tanstack/react-router'

import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import '../styles.css'

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: ({ error }) => (
    <div className="p-8">
      <p role="alert" className="text-red-600 mb-4">
        {error instanceof Error ? error.message : 'Could not load this page'}
      </p>
      <p className="mb-4">
        Check that the backend API is running, then reload this page.
      </p>
      <Link to="/workspaces" className="text-blue-600 underline">
        Back to Workspaces
      </Link>
    </div>
  ),
})

function RootComponent() {
  return (
    <>
      <Outlet />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'TanStack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  )
}
