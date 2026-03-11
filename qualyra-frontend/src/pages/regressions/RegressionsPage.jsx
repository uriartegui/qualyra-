import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getRegressions, createRegression } from '../../api/regressions'
import { getTemplates } from '../../api/templates'
import { Plus, CheckCircle, XCircle, Clock, PlayCircle } from 'lucide-react'
import useAuthStore from '../../store/authStore'

export default function RegressionsPage() {
  const { user } = useAuthStore()
  const canCreate = user?.role !== 'VIEWER'
  const [regressions, setRegressions] = useState([])
  const [templates, setTemplates] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', templateId: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadRegressions()
    getTemplates({ size: 100 }).then(res => {
      setTemplates(res.data.content)
      if (res.data.content.length > 0) setForm(f => ({ ...f, templateId: res.data.content[0].id }))
    })
  }, [])

  const loadRegressions = async () => {
    const res = await getRegressions({ size: 100 })
    setRegressions(res.data.content)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createRegression(form)
      setShowForm(false)
      loadRegressions()
    } finally { setLoading(false) }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Regressões</h1>
          <p className="text-gray-500 mt-1">Execute e acompanhe os testes de regressão.</p>
        </div>
        {canCreate && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700">
            <Plus size={16} /> Nova regressão
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Nova regressão</h3>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ex: Sprint 01 - Regressão"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required autoFocus />
          <select value={form.templateId} onChange={(e) => setForm({ ...form, templateId: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required>
            <option value="">Selecione um template</option>
            {templates.map(t => <option key={t.id} value={t.id}>{t.name} ({t.totalRules} regras)</option>)}
          </select>
          <div className="flex gap-2">
            <button type="submit" disabled={loading}
              className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">Criar</button>
            <button type="button" onClick={() => setShowForm(false)}
              className="border border-gray-300 text-gray-600 text-sm px-4 py-2 rounded-lg hover:bg-gray-50">Cancelar</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {regressions.length === 0 ? (
          <div className="p-12 text-center">
            <PlayCircle size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">Nenhuma regressão ainda.</p>
          </div>
        ) : (
          regressions.map(reg => (
            <Link key={reg.id} to={`/regressions/${reg.id}`}
              className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-medium text-gray-900">{reg.name}</p>
                <p className="text-sm text-gray-400 mt-0.5">{reg.templateName}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex gap-4 text-sm">
                  <span className="flex items-center gap-1.5 text-green-600 font-medium"><CheckCircle size={15} />{reg.passed}</span>
                  <span className="flex items-center gap-1.5 text-red-500 font-medium"><XCircle size={15} />{reg.failed}</span>
                  <span className="flex items-center gap-1.5 text-gray-400"><Clock size={15} />{reg.pending}</span>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  reg.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {reg.status === 'COMPLETED' ? 'Concluída' : 'Em progresso'}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
