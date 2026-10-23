import { createFileRoute, Link } from '@tanstack/react-router'
import { api } from '../../../api'
import type { Workspace } from '../../../api'
import { buttonClassName } from '#/components/button'

export const Route = createFileRoute('/_app/workspaces/')({
  loader: () => api<Workspace[]>('/workspaces/'),
  component: Workspaces,
})

function Workspaces() {
  const workspaces = Route.useLoaderData()

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Workspaces</h1>
        <Link to="/workspaces/create" className={buttonClassName}>
          Create Workspace
        </Link>
      </header>

      <section>
        {workspaces.length > 0 ? (
          <ul className="space-y-4">
            {workspaces.map((workspace) => (
              <li key={workspace.id} className="border border-gray-400 rounded-xl p-4">
                <h2 className="font-bold">
                  <Link
                    to="/workspaces/$workspaceId"
                    params={{ workspaceId: workspace.id }}
                    className="font-bold text-2xl"
                  >
                    {workspace.name}
                  </Link>
                </h2>
                <p className="text-gray-500">{workspace.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No workspaces found.</p>
        )}
      </section>
    </div>
  )
}
