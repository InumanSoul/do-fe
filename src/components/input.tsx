import type { ComponentProps } from 'react'

const Input = ({
  className = 'w-full px-4 py-2 border rounded-lg border-gray-600 focus:outline-blue-500 outline-offset-4',
  ...props
}: ComponentProps<'input'>) => {
  return <input className={className} {...props} />
}

export default Input
