import { statusNormalizer } from '#/utils';
import { api } from '@/api'
import type { Status } from '@/api'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/settings/')({
  loader: () => api<Status[]>('/statuses'),
  component: Settings,
})

function Settings() {
  const statuses = Route.useLoaderData();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p>Manage your application settings here.</p>
      <section className="mt-4 divide-y divide-gray-200 border-gray-200 border rounded-xl">
        {
          statuses.map((status) => (
            <div key={status.id} className="flex items-center space-x-2 px-6 py-4">
              <span className="size-4 rounded-full bg-gray-400">{status.color}</span>
              <span>{statusNormalizer(status).name}</span>
              <input
                type="checkbox"
                checked={status.countAsDone}
                readOnly
              />
            </div>
          ))
        }
      </section>
    </div>
  )
}
