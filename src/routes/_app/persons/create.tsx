import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { api } from '../../../api'
import type { Person } from '../../../api'
import Button from '#/components/button'
import Input from '#/components/input'

export const Route = createFileRoute('/_app/persons/create')({
  component: PersonCreate,
})

function PersonCreate() {
  const navigate = Route.useNavigate()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [usernameOverride, setUsernameOverride] = useState<string | null>(null)

  const suggestedUsername = [name, lastName]
    .map((part) =>
      part
        .normalize('NFD')
        .replace(/\p{M}/gu, '')
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, '.')
        .replace(/^\.+|\.+$/g, ''),
    )
    .filter(Boolean)
    .join('.')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setError('')
    setIsSubmitting(true)
    try {
      await api<Person>('/persons/', {
        method: 'POST',
        body: JSON.stringify({
          username: data.get('username'),
          name: data.get('name'),
          lastName: data.get('lastName'),
          email: data.get('email'),
        }),
      })
      await navigate({ to: '/persons' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create person')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-8">
      <nav className="border-b mb-10">
        <Link to="/persons">Back to Persons</Link>
      </nav>
      <h1 className="text-2xl font-bold mb-4">Create Person</h1>
      <form className="space-y-4 max-w-xl mx-auto" onSubmit={handleSubmit}>
        {error && (
          <p role="alert" className="text-red-600">
            {error}
          </p>
        )}
        <Input
          type="text"
          name="name"
          aria-label="Name"
          onChange={(event) => setName(event.target.value)}
          required
          placeholder="Name"
        />
        <Input
          type="text"
          name="lastName"
          aria-label="Last name"
          onChange={(event) => setLastName(event.target.value)}
          required
          placeholder="Lastname"
        />
        <Input
          type="text"
          name="username"
          aria-label="Username"
          value={usernameOverride ?? suggestedUsername}
          onChange={(event) => setUsernameOverride(event.target.value)}
          required
          placeholder="Username"
        />
        <Input
          type="email"
          name="email"
          aria-label="Email"
          required
          placeholder="example@email.com"
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-full disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Person'}
        </Button>
      </form>
    </div>
  )
}
