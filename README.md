Welcome to your new TanStack Start app!

# Getting Started

To run this application:

```bash
pnpm install
pnpm dev
```

## Local backend API

In the sibling `fastify-do` folder, start PostgreSQL and the API:

```bash
npm install
docker compose up -d
npm run db:migrate
npm run dev
```

Run `pnpm dev` in this frontend folder and open `http://localhost:3000`.
The frontend calls `http://localhost:3030`. In development, the API allows
CORS requests from `http://localhost:3000` and `http://127.0.0.1:3000`, including
JSON POST preflights. This CORS configuration is not enabled outside
`NODE_ENV=development` (set by the backend's `npm run dev`).

Create a person first, then a workspace with that person as owner, then a task
with a workspace and assignee. Each entity has a list and create page linked
from the shared sidebar. Successful submissions return to the updated list; API
errors are shown on the form. Task statuses come from `GET /statuses/`;
the form submits the selected `statusId` and initially selects `todo`.

The backend's status migration seeds `todo`, `in_progress`, and `done` (only
`done` has `countAsDone: true`). Seeded statuses have no `createdBy` because
they belong to the system, not a person. Existing task status names are
preserved as status rows and mapped to IDs before the old text column is removed.
Seeding runs with `npm run db:migrate`, not every time the API starts, and
rerunning that command does not duplicate statuses.

With PostgreSQL running and migrations applied, run `npm test` in `fastify-do`
to verify API creation/listing, validation, and development-only CORS. These
tests create uniquely named records and remove their own data afterward.

# Building For Production

To build this application for production:

```bash
pnpm build
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.

### Removing Tailwind CSS

If you prefer not to use Tailwind CSS:

1. Remove the demo pages in `src/routes/demo/`
2. Replace the Tailwind import in `src/styles.css` with your own styles
3. Remove `tailwindcss()` from the plugins array in `vite.config.ts`
4. Remove `@tailwindcss/vite` and `tailwindcss` from `package.json`

## Linting & Formatting


This project uses [eslint](https://eslint.org/) and [prettier](https://prettier.io/) for linting and formatting. Eslint is configured using [tanstack/eslint-config](https://tanstack.com/config/latest/docs/eslint). The following scripts are available:

```bash
pnpm lint
pnpm format
pnpm check
```



## Routing

This project uses [TanStack Router](https://tanstack.com/router) with file-based routing. Routes are managed as files in `src/routes`.

The root route (`__root.tsx`) owns global styles, error handling, and devtools.
The `/` index route only redirects to `/workspaces` using history replacement.
There is no separate home screen.

Application pages live under the pathless `_app/` layout:

```text
src/routes/
  __root.tsx
  index.tsx
  _app/
    route.tsx
    persons/
      index.tsx
      create.tsx
    workspaces/
      index.tsx
      create.tsx
    tasks/
      index.tsx
      create.tsx
    settings/
      index.tsx
```

`_app/route.tsx` renders the shared sidebar and an `Outlet` for its children.
The leading underscore makes the layout pathless, so URLs remain `/persons`,
`/workspaces`, `/tasks`, and `/settings`, without an `/app` prefix.
Selecting a workspace opens `/workspaces/$workspaceId`. Its loader uses the
route parameter to request `/tasks/?workspaceId=...`, so filtering happens in
the API rather than fetching every task and filtering in the browser.
Keep list and create pages together in their feature folder. After moving or
adding routes, run `pnpm generate-routes`; do not edit `src/routeTree.gen.ts` manually.

### Adding A Route

To add a new route to your application just add a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you render `{children}` in the `shellComponent`.

Here is an example layout that includes a header:

```tsx
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'My App' },
    ],
  }),
  shellComponent: ({ children }) => (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <header>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
          </nav>
        </header>
        {children}
        <Scripts />
      </body>
    </html>
  ),
})
```

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).

## Server Functions

TanStack Start provides server functions that allow you to write server-side code that seamlessly integrates with your client components.

```tsx
import { createServerFn } from '@tanstack/react-start'

const getServerTime = createServerFn({
  method: 'GET',
}).handler(async () => {
  return new Date().toISOString()
})

// Use in a component
function MyComponent() {
  const [time, setTime] = useState('')
  
  useEffect(() => {
    getServerTime().then(setTime)
  }, [])
  
  return <div>Server time: {time}</div>
}
```

## API Routes

You can create API routes by using the `server` property in your route definitions:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

export const Route = createFileRoute('/api/hello')({
  server: {
    handlers: {
      GET: () => json({ message: 'Hello, World!' }),
    },
  },
})
```

## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/people')({
  loader: async () => {
    const response = await fetch('https://swapi.dev/api/people')
    return response.json()
  },
  component: PeopleComponent,
})

function PeopleComponent() {
  const data = Route.useLoaderData()
  return (
    <ul>
      {data.results.map((person) => (
        <li key={person.name}>{person.name}</li>
      ))}
    </ul>
  )
}
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).



# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).

For TanStack Start specific documentation, visit [TanStack Start](https://tanstack.com/start).
