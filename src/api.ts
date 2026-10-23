export type Person = {
  id: string
  username: string
  name: string
  lastName: string
  email: string
  createdAt: string
}

export type Workspace = {
  id: string
  name: string
  description: string | null
  ownerId: string
  type: 'public' | 'private' | null
  createdAt: string
}

export type Status = {
  id: string
  name: string
  color: string | null
  countAsDone: boolean
  createdBy: string | null
  createdAt: string
}

export type Task = {
  id: string
  workspaceId: string
  assignee: string
  title: string
  description: string | null
  statusId: string
  createdAt: string
}

const apiUrl = 'http://localhost:3030'

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
      ...options?.headers,
    },
  })
  if (!response.ok) {
    const body: unknown = await response.json()
    if (typeof body === 'object' && body !== null) {
      if ('message' in body && typeof body.message === 'string') {
        throw new Error(body.message)
      }
      if ('error' in body && typeof body.error === 'string') {
        throw new Error(body.error)
      }
    }
    throw new Error(`Request failed (${response.status})`)
  }
  return response.json()
}
