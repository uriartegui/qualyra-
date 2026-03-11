import { useState, useEffect } from 'react'
import { getUsers, createUser, deactivateUser } from '../../api/users'
import useAuthStore from '../../store/authStore'
import { Plus, Users, UserX, Shield, User } from 'lucide-react'

const roleBadge = {
  OWNER:  'bg-purple-100 text-purple-700',
  ADMIN:  'bg-blue-100 text-blue-700',
  EDITOR: 'bg-green-100 text-green-700',
  VIEWER: 'bg-gray-100 text-gray-600',
}

const roleLabel = { OWNER: 'Owner', ADMIN: 'Admin', EDITOR: 'Editor', VIEWER: 'Viewer' }


export default function UsersPage() {
  const { user: me } = useAuthStore()
  const [users, setUsers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'VIEWER' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const canManage = ['OWNER', 'ADMIN', 'EDITOR'].includes(me?.role)
  const isOwner   = me?.role === 'OWNER'

  const roleOptions =
    me?.role === 'OWNER'  ? [{ value: 'ADMIN', label: 'Admin' }, { value: 'EDITOR', label: 'Editor' }, { value: 'VIEWER', label: 'Viewer' }]
    : me?.role === 'ADMIN' ? [{ value: 'EDITOR', label: 'Editor' }, { value: 'VIEWER', label: 'Viewer' }]
    : [{ value: 'VIEWER', label: 'Viewer' }]

  useEffect(() => { load() }, [])

  const load = async () => {
    const res = await getUsers({ size: 100 })
    setUsers(res.data.content)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await createUser(form)
      setForm({ name: '', email: '', password: '', role: 'VIEWER' })
      setShowForm(false)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar usuário.')
    } finally { setLoading(false) }
  }

  const handleDeactivate = async (id, name) => {
    if (!confirm(`Desativar ${name}?`)) return
    try {
      await deactivateUser(id)
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao desativar.')
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
          <p className="text-gray-500 mt-1">Membros da sua organização.</p>
        </div>
        {canManage && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700">
            <Plus size={16} /> Novo usuário
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleCreate}
          className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Novo usuário</h3>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="João Silva"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required autoFocus />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="joao@empresa.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Mínimo 6 caracteres"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Papel</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {roleOptions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={loading}
              className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              Criar usuário
            </button>
            <button type="button" onClick={() => { setShowForm(false); setError('') }}
              className="border border-gray-300 text-gray-600 text-sm px-4 py-2 rounded-lg hover:bg-gray-50">
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {users.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">Nenhum usuário encontrado.</p>
          </div>
        ) : (
          users.map(u => (
            <div key={u.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${
                  u.active === false ? 'bg-gray-400' : 'bg-indigo-600'
                }`}>
                  {u.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">{u.name}</p>
                    {u.id === me?.id && (
                      <span className="text-xs text-gray-400">(você)</span>
                    )}
                    {u.active === false && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Inativo</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${roleBadge[u.role]}`}>
                  {roleLabel[u.role]}
                </span>
                {isOwner && u.role !== 'OWNER' && u.active !== false && (
                  <button onClick={() => handleDeactivate(u.id, u.name)}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                    <UserX size={14} /> Desativar
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
