import type { Status } from "#/api"

const STATUS_LABELS: Record<string, string> = {
  'done': 'Done',
  'in_progress': 'In Progress',
  'todo': 'To Do',
}

export const statusNormalizer = (status: Status): Status => {
  return {
    ...status,
    name: STATUS_LABELS[status.name] ?? status.name,
  }
}