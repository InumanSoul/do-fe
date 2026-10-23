import { createFileRoute, Link } from '@tanstack/react-router'
import { api } from '../../../api'
import type { Person } from '../../../api'
import { Avatar } from '#/components/avatar'
import { buttonClassName } from '#/components/button'

export const Route = createFileRoute('/_app/persons/')({
  loader: () => api<Person[]>('/persons/'),
  component: Persons,
})

function Persons() {
  const persons = Route.useLoaderData()

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">People</h1>
        <Link to="/persons/create" className={buttonClassName}>
          Create Person
        </Link>
      </header>
      <section>
        {persons.length > 0 ? (
          <ul className="space-y-4">
            {persons.map((person) => (
              <li key={person.id} className="border-b border-gray-200 p-4 flex items-center gap-4">
                <Avatar name={`${person.name} ${person.lastName}`} />
                <div>
                  <h3 className="font-bold">
                    {person.name} {person.lastName}
                  </h3>
                  <p className="text-gray-500">@{person.username}</p>
                </div>
                <p>{person.email}</p>
                <p className="text-gray-500">{person.createdAt}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No persons found.</p>
        )}
      </section>
    </div>
  )
}
