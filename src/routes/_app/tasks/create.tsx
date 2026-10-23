import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { api } from '../../../api'
import type { Person, Status, Task, Workspace } from '../../../api'
import Button from '#/components/button'
import Input from '#/components/input'

export const Route = createFileRoute('/_app/tasks/create')({
  loader: async () => {
    const [persons, workspaces, statuses] = await Promise.all([
      api<Person[]>('/persons/'),
      api<Workspace[]>('/workspaces/'),
      api<Status[]>('/statuses/'),
    ])
    return { persons, workspaces, statuses }
  },
  component: TaskCreate,
})

function TaskCreate() {
  const { persons, workspaces, statuses } = Route.useLoaderData()
  const navigate = Route.useNavigate()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setError('')
    setIsSubmitting(true)
    try {
      await api<Task>('/tasks/', {
        method: 'POST',
        body: JSON.stringify({
          title: data.get('title'),
          description: data.get('description'),
          statusId: data.get('statusId'),
          workspaceId: data.get('workspaceId'),
          assignee: data.get('assignee'),
        }),
      })
      await navigate({ to: '/tasks' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create task')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-8">
      <nav className="border-b mb-10">
        <Link to="/tasks">Back to Tasks</Link>
      </nav>
      <h1 className="text-2xl font-bold mb-4">Create Task</h1>
      {persons.length === 0 && (
        <p className="mb-4">
          <Link to="/persons/create" className="text-blue-600 underline">
            Create a person
          </Link>{' '}
          first to assign the task.
        </p>
      )}
      {workspaces.length === 0 && (
        <p className="mb-4">
          <Link to="/workspaces/create" className="text-blue-600 underline">
            Create a workspace
          </Link>{' '}
          first for the task.
        </p>
      )}
      {statuses.length === 0 && (
        <p role="alert" className="mb-4 text-red-600">
          No statuses found. Run the backend database migrations first.
        </p>
      )}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <p role="alert" className="text-red-600">
            {error}
          </p>
        )}
        <Input
          type="text"
          name="title"
          aria-label="Title"
          placeholder="Task Title"
          required
          className="w-full px-4 py-2 border rounded"
        />
        <textarea
          name="description"
          aria-label="Task description"
          placeholder="Task Description"
          className="w-full px-4 py-2 border rounded"
        />
        <select
          name="workspaceId"
          aria-label="Workspace"
          required
          className="w-full px-4 py-2 border rounded"
        >
          <option value="">Select Workspace</option>
          {workspaces.map((workspace) => (
            <option key={workspace.id} value={workspace.id}>
              {workspace.name}
            </option>
          ))}
        </select>
        <select
          name="assignee"
          aria-label="Assignee"
          required
          className="w-full px-4 py-2 border rounded"
        >
          <option value="">Select Assignee</option>
          {persons.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name} {person.lastName} (@{person.username})
            </option>
          ))}
        </select>
        <select
          name="statusId"
          aria-label="Status"
          defaultValue={
            statuses.find((status) => status.name === 'todo')?.id ?? ''
          }
          required
          className="w-full px-4 py-2 border rounded"
        >
          <option value="">Select Status</option>
          {statuses.map((status) => (
            <option key={status.id} value={status.id}>
              {status.name}
            </option>
          ))}
        </select>
        <Button
          type="submit"
          disabled={
            isSubmitting ||
            persons.length === 0 ||
            workspaces.length === 0 ||
            statuses.length === 0
          }
          className="w-full px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Task'}
        </Button>
      </form>
    </div>
  )
}
