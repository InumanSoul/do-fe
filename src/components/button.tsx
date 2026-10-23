import type { ComponentProps } from 'react'

export const buttonClassName =
  'px-4 py-2 bg-blue-500 hover:bg-blue-400 active:bg-blue-600 duration-200 text-white rounded-full'

const Button = ({
  children,
  className = buttonClassName,
  ...props
}: ComponentProps<'button'>) => {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  )
}

export default Button
