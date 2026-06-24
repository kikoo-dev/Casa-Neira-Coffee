import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Coffee, LayoutDashboard } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()

  const links = [
    { to: '/menu', label: 'Menu', icon: Coffee },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ]

  return (
    <nav className="bg-coffee-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/menu" className="flex items-center gap-2">
            <Coffee className="w-7 h-7 text-coffee-300" />
            <span className="text-xl font-bold tracking-tight">Casa Neira Coffee</span>
          </Link>

          <div className="flex items-center gap-1">
            {links.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to
              return (
                <Link key={to} to={to} className="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:text-coffee-200">
                  <span className="flex items-center gap-1.5">
                    <Icon className="w-4 h-4" />
                    {label}
                  </span>
                  {isActive && (
                    <motion.div layoutId="nav-indicator" className="absolute inset-0 bg-white/10 rounded-lg -z-10" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
