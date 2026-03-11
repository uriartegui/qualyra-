import { useState, useEffect } from 'react'
import { getTemplates, getTemplate, createTemplate, setTemplateRules } from '../../api/templates'
import { getAllRules } from '../../api/rules'
import { Plus, FileText, X, Check } from 'lucide-react'
import useAuthStore from '../../store/authStore'

export default function TemplatesPage() {
  const { user: me } = useAuthStore()
  const canEdit = ['OWNER', 'ADMIN', 'EDITOR'].includes(me?.role)

  const [templates, setTemplates] = useState([])
  const [selected, setSelected] = useState(null)
  const [allRules, setAllRules] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [showSelector, setShowSelector] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const [selectedRuleIds, setSelectedRuleIds] = useState(new Set())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadTemplates()
    getAllRules().then(res => setAllRules(res.data))
  }, [])

  useEffect(() => {
    if (selected) setSelectedRuleIds(new Set(selected.rules?.map(r => r.id) || []))
  }, [selected])

  const loadTemplates = async () => {
    const res = await getTemplates({ size: 100 })
    setTemplates(res.data.content)
  }

  const loadTemplate = async (id) => {
    const res = await getTemplate(id)
    setSelected(res.data)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await createTemplate(form)
      setForm({ name: '', description: '' })
      setShowForm(false)
      await loadTemplates()
      loadTemplate(res.data.id)
    } finally { setLoading(false) }
  }

  const handleSaveRules = async () => {
    setLoading(true)
    try {
      await setTemplateRules(selected.id, { ruleIds: Array.from(selectedRuleIds) })
      setShowSelector(false)
      loadTemplate(selected.id)
    } finally { setLoading(false) }
  }

  const toggleRule = (id) => {
    setSelectedRuleIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const rulesByTopic = allRules.reduce((acc, rule) => {
    if (!acc[rule.topicName]) acc[rule.topicName] = []
    acc[rule.topicName].push(rule)
    return acc
  }, {})

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
          <p className="text-gray-500 mt-1">Crie templates com conjuntos de regras.</p>
        </div>
        {canEdit && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700">
            <Plus size={16} /> Novo template
          </button>
        )}
      </div>

      {canEdit && showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Novo template</h3>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nome do template"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required autoFocus />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Descrição (opcional)"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={2} />
          <div className="flex gap-2">
            <button type="submit" disabled={loading}
              className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">Criar</button>
            <button type="button" onClick={() => setShowForm(false)}
              className="border border-gray-300 text-gray-600 text-sm px-4 py-2 rounded-lg hover:bg-gray-50">Cancelar</button>
          </div>
        </form>
      )}

      <div className="flex gap-6">
        <div className="w-72 space-y-2">
          {templates.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-400 text-sm">
              Nenhum template ainda.
            </div>
          ) : (
            templates.map(t => (
              <div key={t.id} onClick={() => loadTemplate(t.id)}
                className={`bg-white rounded-xl border p-4 cursor-pointer hover:border-indigo-300 transition-colors ${
                  selected?.id === t.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className={selected?.id === t.id ? 'text-indigo-600' : 'text-gray-400'} />
                    <span className={`text-sm font-medium ${selected?.id === t.id ? 'text-indigo-600' : 'text-gray-900'}`}>
                      {t.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{t.totalRules} regras</span>
                </div>
              </div>
            ))
          )}
        </div>

        {selected && (
          <div className="flex-1 bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">{selected.name}</h2>
                {selected.description && <p className="text-sm text-gray-500 mt-0.5">{selected.description}</p>}
              </div>
              {canEdit && (
                <button onClick={() => setShowSelector(true)}
                  className="flex items-center gap-1.5 border border-indigo-600 text-indigo-600 text-sm px-3 py-1.5 rounded-lg hover:bg-indigo-50">
                  <Plus size={15} /> Editar regras
                </button>
              )}
            </div>
            <div className="divide-y divide-gray-100">
              {selected.rules?.length === 0 ? (
                <p className="p-6 text-gray-400 text-sm">Nenhuma regra. {canEdit ? 'Clique em "Editar regras".' : ''}</p>
              ) : (
                selected.rules?.map(rule => (
                  <div key={rule.id} className="p-4">
                    <p className="text-sm font-medium text-gray-900">{rule.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{rule.topicName}</p>
                    {rule.expectedResult && <p className="text-xs text-green-600 mt-1">✓ {rule.expectedResult}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {canEdit && showSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Selecionar regras</h3>
              <button onClick={() => setShowSelector(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {Object.entries(rulesByTopic).map(([topicName, rules]) => (
                <div key={topicName}>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{topicName}</p>
                  <div className="space-y-1">
                    {rules.map(rule => (
                      <div key={rule.id} onClick={() => toggleRule(rule.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedRuleIds.has(rule.id) ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-gray-50 border border-transparent'
                        }`}>
                        <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                          selectedRuleIds.has(rule.id) ? 'bg-indigo-600' : 'border-2 border-gray-300'
                        }`}>
                          {selectedRuleIds.has(rule.id) && <Check size={12} className="text-white" />}
                        </div>
                        <span className="text-sm text-gray-700">{rule.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm text-gray-500">{selectedRuleIds.size} selecionadas</span>
              <div className="flex gap-2">
                <button onClick={() => setShowSelector(false)}
                  className="border border-gray-300 text-gray-600 text-sm px-4 py-2 rounded-lg hover:bg-gray-50">Cancelar</button>
                <button onClick={handleSaveRules} disabled={loading}
                  className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">Salvar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
