import { createBrowserRouter, Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import Layout from '../components/layout/Layout'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import RulesPage from '../pages/rules/RulesPage'
import TemplatesPage from '../pages/templates/TemplatesPage'
import RegressionsPage from '../pages/regressions/RegressionsPage'
import RegressionDetailPage from '../pages/regressions/RegressionDetailPage'
import AccountPage from '../pages/account/AccountPage'
import UsersPage from '../pages/users/UsersPage'

function PrivateRoute({ children }) {
  const { user } = useAuthStore()
  return user ? children : <Navigate to="/login" />
}

function PublicRoute({ children }) {
  const { user } = useAuthStore()
  return !user ? children : <Navigate to="/dashboard" />
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <PublicRoute><LoginPage /></PublicRoute>,
  },
  {
    path: '/register',
    element: <PublicRoute><RegisterPage /></PublicRoute>,
  },
  {
    path: '/',
    element: <PrivateRoute><Layout /></PrivateRoute>,
    children: [
      { index: true, element: <Navigate to="/dashboard" /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'rules', element: <RulesPage /> },
      { path: 'templates', element: <TemplatesPage /> },
      { path: 'regressions', element: <RegressionsPage /> },
      { path: 'regressions/:id', element: <RegressionDetailPage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'account', element: <AccountPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/dashboard" /> },
])

export default router
