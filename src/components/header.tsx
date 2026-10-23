import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

interface HeaderProps {
  title: string
  description: string | null
  link: string
}

export const Header = ({ title, description, link }: HeaderProps) => {
  return (
    <>
      <nav className="mb-10">
        <Link to={link}>
          <ArrowLeft size={24} />
        </Link>
      </nav>
      <header className="mb-8">
        <h1 className="text-4xl font-bold">{title}</h1>
        {description && (
          <p className="text-gray-600">{description}</p>
        )}
      </header>
    </> 
  )
}