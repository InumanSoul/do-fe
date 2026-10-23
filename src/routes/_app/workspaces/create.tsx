import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { api } from '@/api'
import type { Person, Workspace } from '@/api'
import Button from '#/components/button'
import Input from '#/components/input'

export const Route = createFileRoute('/_app/workspaces/create')({
  loader: () => api<Person[]>('/persons/'),
  component: WorkspaceCreate,
})

function WorkspaceCreate() {
  const persons = Route.useLoaderData()
  const navigate = Route.useNavigate()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setError('')
    setIsSubmitting(true)
    try {
      await api<Workspace>('/workspaces/', {
        method: 'POST',
        body: JSON.stringify({
          name: data.get('name'),
          description: data.get('description'),
          ownerId: data.get('ownerId'),
        }),
      })
      await navigate({ to: '/workspaces' })
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not create workspace',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-8">
      <nav className="border-b mb-10">
        <Link to="/workspaces">Back to Workspaces</Link>
      </nav>
      <h1 className="text-2xl font-bold mb-4">Create Workspace</h1>
      {persons.length === 0 && (
        <p className="mb-4">
          <Link to="/persons/create" className="text-blue-600 underline">
            Create a person
          </Link>{' '}
          first to own the workspace.
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
          name="name"
          aria-label="Workspace name"
          required
          placeholder="Workspace Name"
          className="w-full px-4 py-2 border rounded"
        />
        <textarea
          name="description"
          aria-label="Workspace description"
          placeholder="Workspace Description"
          className="w-full px-4 py-2 border rounded"
        />
        <select
          name="ownerId"
          aria-label="Owner"
          required
          className="w-full px-4 py-2 border rounded"
        >
          <option value="">Select Owner</option>
          {persons.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name} {person.lastName} (@{person.username})
            </option>
          ))}
        </select>
        <Button
          type="submit"
          disabled={isSubmitting || persons.length === 0}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Workspace'}
        </Button>
      </form>
    </div>
  )
}
