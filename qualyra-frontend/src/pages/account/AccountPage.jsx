import { useState, useEffect } from 'react'
import { updateMe } from '../../api/users'
import { getMyOrg } from '../../api/organizations'
import useAuthStore from '../../store/authStore'

export default function AccountPage() {
  const { user, setAuth } = useAuthStore()
  const [org, setOrg] = useState(null)
  const [nameForm, setNameForm] = useState({ name: user?.name || '' })
  const [success, setSuccess] = useState('')

  useEffect(() => {
    getMyOrg().then(res => setOrg(res.data))
  }, [])

  const handleUpdateName = async (e) => {
    e.preventDefault()
    try {
      const res = await updateMe(nameForm)
      setAuth({
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken'),
        user: res.data,
      })
      setSuccess('Nome atualizado!')
      setTimeout(() => setSuccess(''), 3000)
    } catch {}
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Conta</h1>

      {success && (
        <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg mb-6">{success}</div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Perfil</h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{user?.role}</span>
          </div>
        </div>
        <form onSubmit={handleUpdateName} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input value={nameForm.name} onChange={(e) => setNameForm({ name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input value={user?.email} disabled
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
          </div>
          <button type="submit" className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700">
            Salvar
          </button>
        </form>
      </div>

      {org && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Organização</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Nome</span>
              <span className="font-medium text-gray-900">{org.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tipo</span>
              <span className="font-medium text-gray-900">{org.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Plano</span>
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">{org.plan}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
