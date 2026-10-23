import { createFileRoute } from '@tanstack/react-router'
import { api } from '@/api'
import type { Status, Task, Workspace } from '@/api'
import { Header } from '#/components/header'
import { Avatar } from '#/components/avatar'
import Button from '#/components/button'

export const Route = createFileRoute('/_app/workspaces/$workspaceId')({
  loader: async ({ params }) => {
    const query = new URLSearchParams({ workspaceId: params.workspaceId })
    const [workspace, tasks, statuses] = await Promise.all([
      api<Pick<Workspace, 'id' | 'name' | 'description'>>(
        `/workspaces/${encodeURIComponent(params.workspaceId)}`,
      ),
      api<Task[]>(`/tasks/?${query}`),
      api<Status[]>('/statuses/'),
    ])
    return { workspace, tasks, statuses }
  },
  component: WorkspaceDetail,
})

function WorkspaceDetail() {
  const { workspace, tasks, statuses } = Route.useLoaderData()

  return (
    <div className="p-8">
      <Header
        title={workspace.name}
        description={workspace.description}
        link="/workspaces"
      />
      <div className="flex items-center space-x-2 mb-10">
        <Avatar name="Anderson"/>
        Owned by
      </div>

      <nav className="flex border-b gap-2 border-gray-400">
        <Button className="px-2 py-1.5 border-b-2 border-gray-950 font-bold">
          Tasks
        </Button>
        <Button className="px-2 py-1.5 border-b-2 border-transparent">
          People
        </Button>
      </nav>
      <section>
        {tasks.length > 0 ? (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li key={task.id} className="border-b border-gray-200 p-4">
                <h3 className="font-bold text-lg">{task.title}</h3>
                <p className="text-gray-600">{task.description}</p>
                <p className="text-sm text-gray-500 w-fit border border-gray-200 px-2 py-1 rounded-full">
                  {statuses.find((status) => status.id === task.statusId)
                    ?.name ?? 'Unknown status'}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tasks found in this workspace.</p>
        )}
      </section>
    </div>
  )
}
