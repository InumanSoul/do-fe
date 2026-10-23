const AVATAR_SIZES = {
  sm: 'size-6',
  md: 'size-10',
  lg: 'size-14',
  xl: 'size-20'
}

export const Avatar = ({ name, size }: { name: string; size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  return (
    <div className={`${AVATAR_SIZES[size || 'md']} rounded-full bg-gray-300 flex items-center justify-center`}>
      <span className="text-white font-bold">{name.charAt(0)}</span>
    </div>
  )
}