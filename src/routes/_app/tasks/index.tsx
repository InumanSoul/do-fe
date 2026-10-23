import { createFileRoute, Link } from '@tanstack/react-router'
import { api } from '../../../api'
import type { Status, Task } from '../../../api'
import { buttonClassName } from '#/components/button'

export const Route = createFileRoute('/_app/tasks/')({
  loader: async () => {
    const [tasks, statuses] = await Promise.all([
      api<Task[]>('/tasks/'),
      api<Status[]>('/statuses/'),
    ])
    return { tasks, statuses }
  },
  component: Tasks,
})

function Tasks() {
  const { tasks, statuses } = Route.useLoaderData()

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Tasks</h1>
        <Link to="/tasks/create" className={buttonClassName}>
          Create Task
        </Link>
      </header>
      <section>
        {tasks.length > 0 ? (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li key={task.id} className="border rounded p-4">
                <h2 className="font-bold">{task.title}</h2>
                <p>{task.description}</p>
                <p>
                  Status:{' '}
                  {statuses.find((status) => status.id === task.statusId)
                    ?.name ?? 'Unknown status'}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tasks found.</p>
        )}
      </section>
    </div>
  )
}
