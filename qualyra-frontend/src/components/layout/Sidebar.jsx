import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, BookOpen, FileText, PlayCircle, User, LogOut, CheckSquare, Users } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { logout } from '../../api/auth'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: null },
  { to: '/rules',     icon: BookOpen,        label: 'Regras',    roles: null },
  { to: '/templates', icon: FileText,        label: 'Templates', roles: null },
  { to: '/regressions', icon: PlayCircle,    label: 'Regressões', roles: null },
  { to: '/users', icon: Users, label: 'Usuários', roles: ['OWNER', 'ADMIN', 'EDITOR'] },
  { to: '/account',   icon: User,            label: 'Conta',     roles: null },
]

export default function Sidebar() {
  const { user, logout: logoutStore } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) await logout({ refreshToken })
    } finally {
      logoutStore()
      navigate('/login')
    }
  }

  const visibleItems = navItems.filter(item =>
    item.roles === null || item.roles.includes(user?.role)
  )

  return (
    <div className="w-64 bg-gray-900 h-screen flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <CheckSquare className="text-indigo-400" size={24} />
          <span className="text-white font-bold text-xl">Qualyra</span>
        </div>
        <p className="text-gray-400 text-xs mt-1 truncate">{user?.email}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {visibleItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-gray-400 text-xs">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm w-full px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </div>
  )
}
